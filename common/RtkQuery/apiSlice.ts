import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { app_config } from "@/config/app";
import Cookies from "js-cookie";

/** ---- Cookie Keys ---- */
const ACCESS_COOKIE = app_config.save_app_key;
const REFRESH_COOKIE = app_config.save_app_refresh;
const ACCESS_TTL_COOKIE = app_config.expire_token;
const REFRESH_TTL_COOKIE = app_config.expire_refresh;

const SKEW_SECONDS = 10 * 1000;
const baseUrl = app_config.serverUrl;


// -------------------- Auth Helpers --------------------
const clearSessionAndRedirect = () => {
    [ACCESS_COOKIE, REFRESH_COOKIE, ACCESS_TTL_COOKIE, REFRESH_TTL_COOKIE].forEach((key) => Cookies.remove(key));
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/");
    }
};

const getNumericCookie = (key) => {
    const v = Cookies.get(key);
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

const isExpired = (expireTime) => {
    if (!expireTime) return true;
    return expireTime < Date.now() - SKEW_SECONDS;
};

// -------------------- Base Queries --------------------
// Base query with Authorization
const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
        const access = Cookies.get(ACCESS_COOKIE);
        if (access) headers.set("authorization", `Bearer ${access}`);
        return headers;
    },
});

// -------------------- Refresh Token --------------------
async function refreshTokens() {
    const refresh = Cookies.get(REFRESH_COOKIE);
    if (!refresh) return { ok: false };

    // استفاده مستقیم از fetch برای جلوگیری از ارسال access token
    const response = await fetch(`${baseUrl}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
        credentials: "omit", // هیچ کوکی access ارسال نشود
    });

    if (!response.ok) return { ok: false, error: await response.text() };

    const data = await response.json();
    const { access, refresh: newRefresh, expire_token, expire_refresh } = data;

    if (access) Cookies.set(ACCESS_COOKIE, access);
    if (newRefresh) Cookies.set(REFRESH_COOKIE, newRefresh);
    if (expire_token) Cookies.set(ACCESS_TTL_COOKIE, String(expire_token * 1000 + Date.now()));
    if (expire_refresh) Cookies.set(REFRESH_TTL_COOKIE, String(expire_refresh * 1000 + Date.now()));

    return { ok: true };
}

// -------------------- Main Wrapped Base Query --------------------
async function baseQueryWithReauth(args, api, extraOptions) {
    if (args?.skipAuth) return rawBaseQuery(args, api, extraOptions);

    const access = Cookies.get(ACCESS_COOKIE);
    const refresh = Cookies.get(REFRESH_COOKIE);
    const accessTtl = getNumericCookie(ACCESS_TTL_COOKIE);
    const refreshTtl = getNumericCookie(REFRESH_TTL_COOKIE);

    if (!access || !refresh || !accessTtl || !refreshTtl) {
        clearSessionAndRedirect();
        return { error: { status: 401, data: { message: "Unauthenticated" } } };
    }

    const accessExpired = isExpired(accessTtl);
    const refreshExpired = isExpired(refreshTtl);

    if (accessExpired) {
        if (refreshExpired) {
            clearSessionAndRedirect();
            return { error: { status: 401, data: { message: "Refresh expired" } } };
        }

        const refreshed = await refreshTokens();
        if (!refreshed.ok) {
            clearSessionAndRedirect();
            return { error: { status: 401, data: { message: "Refresh failed" } } };
        }
    }

    let result = await rawBaseQuery(args, api, extraOptions);

    // // Log all errors for debugging
    // if (result?.error) {
    //     console.log('API Error Details:', {
    //         url: args?.url || 'unknown',
    //         method: args?.method || 'unknown',
    //         status: result.error.status,
    //         data: result.error.data
    //     });
    // }

    if (result?.error?.status === 401) {
        const refreshed = await refreshTokens();
        if (refreshed.ok) result = await rawBaseQuery(args, api, extraOptions);
        else clearSessionAndRedirect();
    }

    return result;
}


export const apptags = [
    "CAPTCHA",
    "TOKEN",
]

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: apptags,
    endpoints: () => ({}),
});

