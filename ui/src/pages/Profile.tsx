import styles from "./Profile.module.css";
import defaultpfp from "../assets/defaultpfp.png"
import defaultbckg from "../assets/defaultbckg.jpg"
import {useEffect, useState} from "react";
import randomBckg from "../assets/randomBckg.jpg"

interface ProfileProps {
    pfp?: string;
    fname: string;
    lname: string;
    email: string;
    location: string;
}

const Profile = () => {
    const [user, setUser] = useState<ProfileProps | null>(null);

    useEffect(() => {
        const fetchProfile = async() => {
            try{
                const response = await fetch("http://localhost:5000/get_user_info", {
                    credentials: "include"
                });
                if (!response.ok) throw new Error("Failed to fetch profile information");
                const data = await response.json();
                console.log("GOT DA DATA", data);

                setUser(data);
            } catch (error){
                console.error("Error fetching profile info", error);
            }
        };
        fetchProfile();
    }, []);

    if (!user) return (
        <section
            className={styles.profileDefault}
            style={{backgroundImage: `url(${randomBckg})`}}    >
            <section className={styles.profileDefaultContent}>
                <h1>Log in to see the profile content</h1>
                <section>
                    <a href={"/login_signup"} >
                        <button className={styles.getStartedButton}>
                            Get Started
                        </button>
                    </a>
                </section>
            </section>
        </section>
    )

    return (
        <section className={styles.profileContainer}>
            <section
                className={styles.backgroundBanner}
                style={{ backgroundImage: `url(${defaultbckg})` }}>
            </section>
            <section className={styles.profileBox}>
                <section className={styles.profilePicWrapper}>
                    <img
                        src={user.pfp || defaultpfp}
                        alt={"Profile picture"}
                        className={styles.profilePicture}/>
                </section>
                <section className={styles.userInfo}>
                    <h2>{user.fname} {user.lname}</h2>
                    <p>Email: {user.email}</p>
                    <p>Location: {user.location}</p>
                </section>
            </section>
        </section>
    )
}

export default Profile;