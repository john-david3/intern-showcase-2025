import styles from "./Profile.module.css"

// interface ProfileProps {
//     pfp: string;
//     background: string;
//     fname: string;
//     lname: string;
//     email: string;
//     location: string;
// }

const Profile = () => {
    return (
        <section className={styles.profilePage}>
            <section className={styles.profileBox}>
                <section className={styles.backgroundImage}>
                </section>

            </section>
            <section className={styles.LocationBox}>

            </section>
        </section>
    )
}

export default Profile;