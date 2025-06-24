import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Auth.module.css"

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
                const response = await fetch("http://localhost:5000/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data.account_created) {
                    console.log("Registration Successful! Account created successfully");
                    setIsLoggedIn(true);
                    window.location.reload()
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
        <section className={styles.authform}>
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
                <select name="location" onChange={handleInputChange}>
                    <option>Seattle, WA, USA</option>
                    <option>Australia</option>
                    <option>Bangalore, India</option>
                    <option>Barcelona, Spain</option>
                    <option>Boulder, CO, USA</option>
                    <option>Brazil</option>
                    <option>Chertsey, UK</option>
                    <option>China</option>
                    <option>Czech Republic</option>
                    <option>France</option>
                    <option>Germany</option>
                    <option>Hyderabad, India</option>
                    <option>Ireland</option>
                    <option>Israel</option>
                    <option>Italy</option>
                    <option>Japan</option>
                    <option>London, UK</option>
                    <option>Madrid, Spain</option>
                    <option>Malaysia</option>
                    <option>Mexico</option>
                    <option>Mumbai, India</option>
                    <option>Netherlands</option>
                    <option>New Delhi, India</option>
                    <option>New Zealand</option>
                    <option>Philippines</option>
                    <option>Poland</option>
                    <option>Qatar</option>
                    <option>San Jose, CA, USA</option>
                    <option>Singapore</option>
                    <option>South Korea</option>
                    <option>Thailand</option>
                    <option>Toronto, ON, Canada</option>
                    <option>UAE</option>
                    <option>Vietnam</option>
                </select>

                <button type="submit">Signup</button>
            </form>
        </section>
    );
};

export default SignupForm;
