import { useEffect } from "react";
import styles from "./Groups.module.css"

const JoinRandomGroup = () => {

    useEffect(() => {
        async function join_group() {
            try {
                console.log("Checking status...")
                const response = await fetch("http://localhost:5000/join_random_group", {
                    credentials: "include",
                });
                const data = await response.json();
                console.log("Joined group: ", data);
            } catch (error) {
                console.log("Could not join group")
            }
        }
        join_group()
    });

    return (
        <section className={styles.joinrandom}>
            <h2>Join a Random Group</h2>
        </section>
    );
};

export default JoinRandomGroup;
