import React, { useState } from "react";
import AuthCheck from "../Auth/AuthCheck.tsx";
import styles from "./Groups.module.css"

interface JoinFormData {
    code: string;
}

interface FormErrors {
    code?: string;
    general?: string;
}

const JoinGroup = () => {

    <AuthCheck />

    const [errors, setErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState<JoinFormData>({
        code: ""
    });

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
            if (!formData[key as keyof JoinFormData]) {
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
                const response = await fetch("http://localhost:5000/join_group", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                console.log(data, data.joined_group)

                if (data.joined_group == "true") {
                    console.log("Joined group successfully");
                } else {
                    console.log("Failed to join group.");
                }
            } catch (error) {
                console.error("Error Joining Group:", error);
                setErrors({
                    general: "An error occurred during joining",
                });
            }
        }
    };

    return (
        <section className={styles.joingroup}>
            <h2>Join a Group via Code</h2>
            <form onSubmit={handleSubmit} id="join-group-form">
                {errors.general && (
                    <p>{errors.general}</p>
                )}

                {errors.code && (
                    <p> {errors.code}</p>
                )}
                <input
                    className={styles.groupinput}
                    name="code"
                    type="text"
                    placeholder="Enter Code"
                    onChange={handleInputChange}
                    value={formData.code}
                />

                <button type="submit">Join</button>
            </form>
        </section>
    );
};

export default JoinGroup;