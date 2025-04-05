import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const Chat = () => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/chat-websocket');
        const client = Stomp.over(socket);
        
        client.connect({}, () => {
            setStompClient(client);
            client.subscribe('/topic/public', (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, receivedMessage]);
            });
        });

        return () => {
            if (client) client.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (stompClient && messageInput) {
            const message = {
                sender: "User1",
                content: messageInput,
                roomId: "public",
            };
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
            setMessageInput('');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="h-64 overflow-y-auto border p-2 mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.sender}: </strong>{msg.content}
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 p-2 border rounded-l"
                    placeholder="Nhập tin nhắn..."
                />
                <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-500 text-white rounded-r"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default Chat;