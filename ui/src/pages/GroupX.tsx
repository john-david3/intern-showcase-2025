import {useEffect, useState} from "react";
import AuthCheck from "../components/Auth/AuthCheck";
import {useParams} from "react-router-dom";
import Wheel from "../components/Wheel/Wheel.tsx";
import styles from "../components/Groups/Groups.module.css"
import Chat from "../components/Chat/Chat.tsx";

const GroupX = () => {
    const [groupInfo, setGroupInfo] = useState<Map<string, string[]>>();
    const { gid } = useParams();

    <AuthCheck />

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get_group_info/${gid}`, {
                    credentials: "include"
                });
                if (!response.ok) throw new Error("Failed to fetch group info");
                const data: Map<string, string[]> = await response.json();
                console.log(data);

                setGroupInfo(data);
            } catch (error) {
                console.error("Error fetching groups: ", error);
            }
        };

        fetchGroupInfo();
    }, []);

    return (
        <section className={styles.groupx}>
            <section className={styles.groupxInfo}>
                <h2>Group: {groupInfo ? groupInfo["data"][0] : "data"}</h2>
                <p>Description: {groupInfo ? groupInfo["data"][1] : "data"}</p>
                <p>Code: {groupInfo ? groupInfo["data"][2] : "data"}</p>
            </section>

            <section>
                <Wheel />
            </section>

            <section>
                <Chat groupId={gid}></Chat>
            </section>
        </section>
    )
}

export default GroupX;
