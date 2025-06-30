import { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext.tsx";
import ChatForm from "./ChatForm.tsx";

type Message = {
    name: string;
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
            <h2>Chat</h2>
            <p><strong>Nutsa B:</strong> Hey everyone! Want to get some lunch?</p>
            <p><strong>John David W:</strong> Yeah! Where do you want to go?</p>
            <p><strong>Nutsa B:</strong> I don't know. How about we spin the wheel!</p>
            <p><strong>Mohamad A:</strong> Great idea!</p>
            {messages.map((msg, idx) => (
                <section className="chatBox" key={idx}>
                    <strong>{msg.name}:</strong> {msg.message}
                </section>
            ))}
            <ChatForm groupId={groupId}></ChatForm>
        </section>
    );
};

export default Chat;