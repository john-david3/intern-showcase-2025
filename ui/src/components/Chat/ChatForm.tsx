import React, { useState } from "react";
import { useSocket } from "../../contexts/SocketContext.tsx";
import styles from './chat.module.css'

interface ChatFormData {
    message: string;
}

interface FormErrors {
    message?: string;
    general?: string;
}

const ChatForm = ({ groupId }: {groupId: string}) => {
    const { socket, isConnected } = useSocket();
    const [ errors, setErrors ] = useState<FormErrors>({});
    const [formData, setFormData] = useState<ChatFormData>({message: ""});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Check for empty fields
        if (!formData.message) {
            newErrors.message = "This field is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (socket && isConnected) {
            socket.emit("send_message", {
                group_id: groupId,
                message: formData.message,
            });
            setFormData({ message: ""})
        } else {
            console.error("Socket not connected");
            setErrors({ general: "Socket connection lost"});
        }
    };

    return (
        <section className={styles.chatSection}>
            <form onSubmit={handleSubmit} id="chat">
                <input
                    name="message"
                    type="text"
                    placeholder="Enter Chat Message"
                    onChange={handleInputChange}
                    value={formData.message}
                />

                <button type="submit">Send Chat</button>
            </form>
        </section>
    );
};

export default ChatForm;