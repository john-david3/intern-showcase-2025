import React, { useState } from "react";
import AuthCheck from "../Auth/AuthCheck.tsx";
import styles from "./Groups.module.css"

interface GroupFormData {
    name: string;
    desc?: string;
    is_random?: string;
}

interface FormErrors {
    name?: string;
    desc?: string;
    is_random?: string;
    general?: string;
}

const CreateGroup = () => {

    <AuthCheck />

    const [errors, setErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState<GroupFormData>({
        name: "",
        desc: "",
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
            if (!formData[key as keyof GroupFormData]) {
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
                const response = await fetch("http://localhost:5000/create_group", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data.group_created == "true") {
                    console.log("Group created successfully");
                } else {
                    console.log("Failed to create group.");
                }
            } catch (error) {
                console.error("Error Creating Group:", error);
                setErrors({
                    general: "An error occurred during creation",
                });
            }
        }
    };

    return (
        <section className={styles.creategroup}>
            <h2>Create a Group</h2>
            <form onSubmit={handleSubmit} id="create-group-form">
                {errors.general && (
                    <p>{errors.general}</p>
                )}

                {errors.name && (
                    <p> {errors.name}</p>
                )}
                <input
                    className={styles.groupinput}
                    name="name"
                    type="text"
                    placeholder="Enter Group Name"
                    onChange={handleInputChange}
                    value={formData.name}
                />

                {errors.desc && (
                    <p>{errors.desc}</p>
                )}
                <input
                    className={styles.groupinput}
                    name="desc"
                    type="text"
                    placeholder="Enter Group Description"
                    onChange={handleInputChange}
                    value={formData.desc}
                />

                {errors.is_random && (
                    <p>{errors.is_random}</p>
                )}
                <label>Random Group?</label>
                <input
                    name="is_random"
                    type="checkbox"
                    onChange={handleInputChange}
                    value={formData.is_random}
                />

                <button type="submit">Create Group</button>
            </form>
        </section>
    );
};

export default CreateGroup;