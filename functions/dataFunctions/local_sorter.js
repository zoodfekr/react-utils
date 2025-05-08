

export const local_sorter = ({ data = [], key, direction }) => {


    let value = [...data];
    let box = [];


    let strind_data = ["name", "displayname", "report_id", "displayname", "device_id", "sender",
        "room_id", "creator", "user_id",
        "display_name", "media_id", "upload_name", "display_name", "quarantined_by", 'url', 'app_display_name', 'kind']

    let number_data = ["last_seen_ts", "creation_ts", 'report_count', "report_length", "state_events",
        "joined_local_members", "media_count", "origin_server_ts",
        "last_seen_ip", "last_seen", "ip", "media_length", "last_access_ts", "created_ts"]


    if (direction === "ascending") {

        if (strind_data.includes(key)) {
            box = value.slice().sort((a, b) => (a[key] || "").localeCompare(b[key] || ""));
        }
        else if (number_data.includes(key)) {
            box = value.slice().sort((a, b) => a[key] - b[key])
        }
        else {
            box
        }

    } else if (direction === "descending") {

        if (strind_data.includes(key)) {
            box = value.slice().sort((a, b) => (b[key] || "").localeCompare(a[key] || ""));
        }
        else if (number_data.includes(key)) {
            box = value.slice().sort((a, b) => b[key] - a[key])
        }
        else {
            box
        }
    }

    return box
}

