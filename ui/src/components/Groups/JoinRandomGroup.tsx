import {useEffect, useState} from "react";
import styles from "./Groups.module.css"

const JoinRandomGroup = () => {
    const [displayedResult, setdisplayedResult] = useState(false);

    useEffect(() => {
        const join_group = async() => {
            try {
                console.log("Checking status...")
                const response = await fetch("http://localhost:5000/join_random_group", {
                    credentials: "include"
                });
                console.log("STATUS CHECKED")
                if (!response.ok) throw new Error("Failed to join random group");
                const data = await response.json();
                if (data.joined_group == "true"){
                    console.log("Joined group: ", data);
                    setdisplayedResult(true);
                } else {
                    console.log("Could not join random group")
                    setdisplayedResult(false)
                }

            } catch (error) {
                console.log("Could not join group")
            }
        }
        join_group()
    }, []);

    return (
        <section className={styles.joinrandom}>
            <h1>Join a Random Group</h1>
            <p>{ displayedResult ? "Successfully joined a random group" : "Could not join a random group" }</p>
        </section>
    );
};

export default JoinRandomGroup;
