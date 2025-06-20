import { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext.tsx";

const Chat = ({ groupId }) => {
    const socket = useSocket();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data) => {
            setMessages((prev) => [...prev, data]);
        };

        socket.emit("join", { group_id: groupId});
        socket.on("new_message", handleNewMessage);

        return () => {
            socket.emit("leave", { group_id: groupId });
            socket.on("new_message", handleNewMessage);
        }
    }, [socket, groupId])

    return (
        <section className="chat_window">
            {messages.map((msg, idx) => (
                <section key={idx}>
                    <strong>{msg.email}:</strong> {msg.message}
                </section>
            ))}
        </section>
    );
};

export default Chat;