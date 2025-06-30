import styles from "./Profile.module.css";
import defaultpfp from "../assets/defaultpfp.png"
import defaultbckg from "../assets/defaultbckg.jpg"
import {useEffect, useState} from "react";

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
        fetch("api/get_user_info")
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Failed to get user data: ", err))
    }, []);

    if (!user) return (<p>Loading user data</p>)

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