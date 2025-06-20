import React, { useState } from "react";

interface ChatFormData {
    message: string;
}

interface FormErrors {
    message?: string;
    general?: string;
}

const ChatForm = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});

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
        Object.keys(formData).forEach((key) => {
            if (!formData[key as keyof ChatFormData]) {
                newErrors[key as keyof FormErrors] = "This field is required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch("http://localhost:5000/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data) {
                    console.log("Chat sent!");
                    setIsLoggedIn(true);
                } else {
                    console.log("Failed to send chat.");
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error Chatting:", error);
                setErrors({
                    general: "An error occurred during chatting",
                });
            }
        }
    };

    return (
        <section>
            <h2>Chat</h2>
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