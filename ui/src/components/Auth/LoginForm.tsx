import React, { useState } from "react";
import styles from "./Auth.module.css"

interface LoginFormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

const LoginForm = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
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
            if (!formData[key as keyof LoginFormData]) {
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
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data.logged_in) {
                    console.log("Login Successful!");
                    setIsLoggedIn(true);
                    window.location.reload();
                } else {
                    console.log("Failed to log in.");
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error Login:", error);
                setErrors({
                    general: "An error occurred during login",
                });
            }
        }
    };

    return (
        <section className={styles.authform}>

            <form onSubmit={handleSubmit} id="login-form">
                {errors.general && (
                    <p>{errors.general}</p>
                )}

                {errors.email && (
                    <p> {errors.email}</p>
                )}
                <input
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    onChange={handleInputChange}
                    value={formData.email}
                />

                {errors.password && (
                    <p>{errors.password}</p>
                )}
                <input
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    onChange={handleInputChange}
                    value={formData.password}
                />

                <button type="submit">Login</button>
            </form>
        </section>
    );
};

export default LoginForm;