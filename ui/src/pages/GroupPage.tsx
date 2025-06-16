import {useEffect, useState} from "react";
import AuthCheck from "../components/Auth/AuthCheck";


const GroupPage = () => {
    const [groupData, setGroupData] = useState<string[]>([]);

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

        fetchUserGroups();  // Always try
    }, []);



    return (
        <section>
            <h2>My Groups</h2>
            <ul>
                {Object.entries(groupData).map(([key, values]) => (
                    <li key={key}>
                        {values[0]}) <strong>{values[1]}</strong>: {values[2]}
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default GroupPage;
