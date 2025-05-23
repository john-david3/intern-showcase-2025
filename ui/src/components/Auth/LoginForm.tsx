import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

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
    const { isLoggedIn, setIsLoggedIn } = useAuth();
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
                const response = await fetch("http://127.0.0.1:8080/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data.account_created) {
                    console.log("Registration Successful! Account created successfully");
                    setIsLoggedIn(true);
                } else {
                    console.log("Failed to create account.");
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error Registering:", error);
                setErrors({
                    general: "An error occurred during registration",
                });
            }
        }
    };

    return (
        <section>
            <h2>Login</h2>
            <p>is Logged in? : {isLoggedIn}</p>
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