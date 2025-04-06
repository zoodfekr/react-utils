export const setcookie = (cname, cvalue, expire) => {
    let date = new Date();
    date.setTime(date.getTime() + (expire * 1000));
    let expires = date.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`
}

export const setcookie_uid = (cname, cvalue) => {
    let date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    let expires = date.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`
}

export const delcookie = (cname) => {
    return new Promise((resolve, reject) => {
        try {
            document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            resolve(true); // If the cookie is successfully deleted
        } catch (error) {
            reject(new Error('Failed to delete the cookie')); // If an error occurs
        }
    });
};


export const getCookie = (c_name) => {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}


export const checkCookie = (props) => {
    var username = getCookie(props); // change name to username
    if (username == "" || username == null || username == undefined) { // change || to &&
        return false
    } else {
        return true
    }
}
