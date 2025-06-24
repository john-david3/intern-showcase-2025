import { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext.tsx";
import ChatForm from "./ChatForm.tsx";

type Message = {
    email: string;
    message: string;
}

const Chat = ({ groupId }: { groupId: string }) => {
    const { socket, isConnected } = useSocket();

    console.log(groupId);
    if (!isConnected || !socket) return;
    console.log(socket);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data) => {
            console.log("BOXBOX");
            setMessages((prev) => [...prev, data]);
        };

        socket.emit("join", { group_id: groupId});
        socket.on("new_message", handleNewMessage);

        return () => {
            socket.emit("leave", { group_id: groupId });
            socket.off("new_message", handleNewMessage);
        }
    }, [socket, groupId])

    return (
        <section className="chat_window">
            {messages.map((msg, idx) => (
                <section key={idx}>
                    <strong>{msg.email}:</strong> {msg.message}
                </section>
            ))}
            <ChatForm groupId={groupId}></ChatForm>
        </section>
    );
};

export default Chat;