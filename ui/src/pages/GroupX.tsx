import {useEffect, useState} from "react";
import AuthCheck from "../components/Auth/AuthCheck";
import {useParams} from "react-router-dom";
import Wheel from "../components/Wheel/Wheel.tsx";
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
        <>
            <section>
                <h2>{groupInfo ? groupInfo["data"][0] : "data"}</h2>
                <p>Description: {groupInfo ? groupInfo["data"][1] : "data"}</p>
                <p>Code: {groupInfo ? groupInfo["data"][2] : "data"}</p>
            </section>

            <section>
                <Wheel />
            </section>

            <section>
                <p>1</p>
                <Chat groupId={gid}></Chat>
                <p>2</p>
            </section>
        </>
    )
}

export default GroupX;
