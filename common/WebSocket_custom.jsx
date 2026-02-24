
import { useEffect } from "react";
import useWebSocketLib from "react-use-websocket";
import { websocket_url } from "../../app_setting";

const WebSocket_custom = () => {

    const {
        sendMessage,
        lastMessage,
        readyState,
        getWebSocket
    } = useWebSocketLib(websocket_url, {
        shouldReconnect: (closeEvent) => true, // اتوماتیک reconnect در صورت قطع اتصال
    });

    let socket_data = lastMessage?.data ? JSON.parse(lastMessage.data) : {};

    useEffect(() => {
        //console.log"websocket:", socket_data);
    }, [socket_data]);

    return (
        <>
        </>
    )


};

export default WebSocket_custom;
