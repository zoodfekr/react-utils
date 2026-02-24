import { EndpointBuilder } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./apiSlice";
import Cookies from "js-cookie";
import { app_config } from "@/config/app";
import { converJalaliToUtc } from "@/common/functions/converJalaliToUtc";
import { userResponseValueTpe } from "@/types/users";




// هوک های مدیریت اطلاعات


export const captchaApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // ? دریافت کاربران
        getUsers: builder.query<userResponseValueTpe, any>({
            query: (props: any) => {

                const url = `api/users/karbar/`;
                const method = "GET";

                // Initialize params with all possible properties to avoid TypeScript errors
                const params: {
                    size?: any;
                    first_name?: any;
                    last_name?: any;
                    phone_number?: any;
                    user?: any;
                    is_active?: any;
                    jaigah?: any;
                    sathekarbar?: any;
                    last_login_from?: any;
                    last_login_to?: any;
                    updated_at_from?: any;
                    updated_at_to?: any;
                    advance_filter?: boolean;
                    sort?: any
                } = {
                    size: props.page_size,
                    sort: props.sort || '-created_at',
                };

                // Check if advance filter is enabled
                if (props.type === 'advance') {

                    // console.log('data in redux - userplace', props);


                    params.advance_filter = true

                    // Use specific filter parameters
                    if (props.value.first_name) params.first_name = props.value.first_name;
                    if (props.value.last_name) params.last_name = props.value.last_name;
                    if (props.value.phone_number) params.phone_number = props.value.phone_number;
                    if (props.value.username) params.user = props.value.username;
                    if (props.value.is_active && (['true', 'false'].includes(props.value.is_active))) params.is_active = props.value.is_active;
                    if (props.value.jaigah) params.jaigah = props.value.jaigah;
                    if (props.value.sathekarbar) params.sathekarbar = props.value.sathekarbar;

                    // ? آخرین لاگین کاربر
                    if (props.value.last_login_from) params.last_login_from = converJalaliToUtc(props.value.last_login_from);
                    if (props.value.last_login_to) params.last_login_to = converJalaliToUtc(props.value.last_login_to);

                    // if (props.value.updated_at_from) params.updated_at_from = converJalaliToUtc(props.value.updated_at_from);
                    // if (props.value.updated_at_to) params.updated_at_to = converJalaliToUtc(props.value.updated_at_to);
                } else {
                    // Use value for all fields
                    if (props.value) {
                        params.first_name = props.value;
                        params.last_name = props.value;
                        params.phone_number = props.value;
                        params.user = props.value;
                    }
                }

                return {
                    url,
                    method,
                    params
                };
            },
            providesTags: ["USERS"]
        }),


        //? مدیریت کاربر کاربر
        handleUser: builder.mutation({
            query: (props) => {

                const isEdit = props.type === "edit";
                const url = isEdit ? `api/users/karbar/${props.id}/` : `api/users/karbar/`;
                const method = isEdit ? "PUT" : "POST";

                return {
                    url,
                    method,
                    body: {
                        first_name: props.body.first_name,
                        last_name: props.body.last_name,
                        phone_number: props.body.phone_number,
                        sathekarbar: parseInt(props.body.sathekarbar),
                        username: props.body.username,
                        password: props.body.password,
                        is_active: props.body.is_active,
                        jaigah: +props.body.jaigah
                    },
                };
            },
            invalidatesTags: ["USERS"]
        }),



        //? حذف کاربر
        deleteUser: builder.mutation({
            query: (props) => ({
                url: `api/users/karbar/${props.id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["USERS"]
        }),

        //? حذف گروهی کاربران
        bulkDeleteUsers: builder.mutation({
            query: (props) => ({
                url: `api/users/karbar/bulk-delete/`,
                method: "POST",
                body: {
                    ids: props.ids
                },
            }),
            invalidatesTags: ["USERS"]
        }),

    }),
    overrideExisting: false,
});
// این خط hook را استخراج و export می‌کند
export const {
    useGetUsersQuery, // دریافت لیست کاربران
    useHandleUserMutation, // افزودن کاربر
    useDeleteUserMutation, // حذف کاربر
    useBulkDeleteUsersMutation, // حذف گروهی کاربران
} = captchaApi;