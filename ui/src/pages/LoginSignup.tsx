import styles from "../components/Auth/Auth.module.css"
import LoginForm from "../components/Auth/LoginForm.tsx";
import SignupForm from "../components/Auth/SignupForm.tsx";
import {useState} from "react";

const Auth = () => {
    const [openForm, setOpenForm] = useState<"login" | "signup">("login");
    return (
        <section className={styles.authContainer}>
            <section className={styles.authBox}>
                <h1>{openForm === "login" ? "Login Form" : "Signup Form"}</h1>
                <section className={styles.authBtns}>
                    <button className={`${styles.authBtnBase} ${styles.loginBtn} 
                        ${openForm === "login" ? styles.open: ""}`}
                        onClick={() => setOpenForm("login")}>
                        Login
                    </button>
                    <button className={`${styles.authBtnBase} ${styles.signupBtn} 
                        ${openForm === "signup" ? styles.open: ""}`}
                        onClick={() => setOpenForm("signup")}>
                        Signup
                    </button>
                </section>
                {openForm === "login" ? <LoginForm /> : <SignupForm />}
            </section>
        </section>
    )
}

export default Auth;