import {useEffect, useState} from "react";
import AuthCheck from "../components/Auth/AuthCheck";
import {Link} from "react-router-dom";
import styles from "../components/Groups/Groups.module.css"
import CreateGroup from "../components/Groups/CreateGroup.tsx";
import JoinGroup from "../components/Groups/JoinGroup.tsx";
import JoinRandomGroup from "../components/Groups/JoinRandomGroup.tsx";


const GroupPage = () => {
    const [groupData, setGroupData] = useState<string[]>([]);
    const [isRandomOpen, setRandomOpen] = useState(false);
    <AuthCheck />

    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                const response = await fetch("http://localhost:5000/get_groups", {
                    credentials: "include"
                });
                if (!response.ok) throw new Error("Failed to fetch groups");
                const data: Record<string, string[]> = await response.json();
                console.log(data);

                setGroupData(data);
            } catch (error) {
                console.error("Error fetching groups: ", error);
            }
        };

        fetchUserGroups();
    }, []);

    const openRandom = () => {
        setRandomOpen(true);
    }

    const closeRandom = () => {
        setRandomOpen(false);
    }

    return (
        <section className={styles.groupsPage}>
            <section className={styles.mygroups}>
                <h2>My Groups</h2>
                <ul>
                    {Object.entries(groupData).map(([key, values]) => (
                        <Link to={`/group/${values[0]}`}>
                            <li key={key}>
                                {values[0]}) <strong>{values[1]}</strong>: {values[2]}
                            </li>
                        </Link>
                    ))}
                </ul>
            </section>
            <CreateGroup />
            <JoinGroup />
            <button onClick={openRandom}>Join a Random Group</button>

            {
                isRandomOpen && (
                    <section className={styles.joinRandomWindow}>
                        <JoinRandomGroup />
                        <button onClick={closeRandom} className={styles.closeBtn}>Close</button>
                    </section>

                )
            }
        </section>
    )
}

export default GroupPage;