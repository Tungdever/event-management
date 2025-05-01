import React, { createContext, useContext, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);

    const CustomToast = ({ title, message }) => (
        <div>
            <strong>{title}</strong>
            <div>{message}</div>
        </div>
    );

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        const token = localStorage.getItem("token");
        let userId;

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                userId = payload.userId;
            } catch (e) {
                console.error("Error decoding token:", e);
            }
        }

        client.connect(
            {},
            () => {
                console.log("Connected to WebSocket");
                if (userId) {
                    client.subscribe(`/user/${userId}/specific`, (message) => {
                        const parsedMessage = JSON.parse(message.body);
                        toast.info(
                            <CustomToast
                                title={parsedMessage.title || "Thông báo mới"}
                                message={parsedMessage.message || "Bạn có một thông báo mới!"}
                            />,
                            {
                                position: "bottom-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            }
                        );
                    });
                }
                setStompClient(client);
            },
            (error) => {
                console.error("WebSocket connection failed:", error);
                toast.error("Không thể kết nối đến server thông báo. Vui lòng thử lại sau.");
            }
        );

        return () => {
            if (client) {
                client.disconnect(() => console.log("Disconnected from WebSocket"));
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ stompClient }}>
            {children}
            <ToastContainer />
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);