import {useEffect, useState} from "react";
import AuthCheck from "../components/Auth/AuthCheck";
import {useParams} from "react-router-dom";


const GroupX = () => {
    const [groupData, setGroupData] = useState<string[]>([]);
    const { gid } = useParams();

    <AuthCheck />

    useEffect(() => {
        const fetchGroupInfo = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get_group_info/${gid}`, {
                    credentials: "include"
                });
                if (!response.ok) throw new Error("Failed to fetch group info");
                const data: Record<string, string[]> = await response.json();
                console.log(data);

                setGroupData(data);
            } catch (error) {
                console.error("Error fetching groups: ", error);
            }
        };

        fetchGroupInfo();
    }, []);



    return (
        <section>
            <h2>{groupData["data"][0]}</h2>
            <p>{groupData["data"][1]}</p>
            <p>Code: {groupData["data"][2]}</p>
        </section>
    )
}

export default GroupX;
