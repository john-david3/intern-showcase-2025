import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface RegisterFormData {
    email: string;
    password: string;
    password2: string;
    location: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    password2?: string;
    location?: string;
    general?: string;
}

const SignupForm = () => {
    const { setIsLoggedIn } = useAuth();
    const [errors, setErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState<RegisterFormData>({
        email: "",
        password: "",
        password2: "",
        location: "",
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
            if (!formData[key as keyof RegisterFormData]) {
                newErrors[key as keyof FormErrors] = "This field is required";
            }
        });

        // Check password match
        if (formData.password !== formData.password2) {
            newErrors.password2 = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch("/api/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data.account_created) {
                    console.log("Registration Successful! Account created successfully");
                    setIsLoggedIn(true);
                    window.location.reload();
                } else {
                    // Handle validation errors from server
                    if (data.error_fields) {
                        const newErrors: FormErrors = {};
                        for (const field of data.error_fields) {
                            newErrors[field as keyof FormErrors] = data.message;
                        }
                        setErrors(newErrors);
                    } else {
                        // If no specific fields are indicated, set a general error
                        setErrors({
                            general: data.message || "An error occurred during registration",
                        });
                    }
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
            <h2>Signup</h2>
            <form onSubmit={handleSubmit} id="register-form">
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

                {errors.password2 && (
                    <p>{errors.password2}</p>
                )}
                <input
                    name="password2"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={handleInputChange}
                    value={formData.password2}
                />

                {errors.location && (
                    <p>{errors.location}</p>
                )}
                <input
                    name="location"
                    type="text"
                    placeholder="Enter Office Location"
                    onChange={handleInputChange}
                    value={formData.location}
                />

                <button type="submit">Signup</button>
            </form>
        </section>
    );
};

export default SignupForm;