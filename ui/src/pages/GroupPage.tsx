import {useEffect} from "react";
import AuthCheck from "../components/Auth/AuthCheck";


const GroupPage = () => {

    <AuthCheck />

    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                const response = await fetch("http://localhost:5000/get_groups", {
                    credentials: "include"
                });
                if (!response.ok) throw new Error("Failed to fetch groups");
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error("Error fetching groups: ", error);
            }
        };

        fetchUserGroups();  // Always try
    }, []);



    return (
        <section>
            <h2>My Groups</h2>

        </section>
    )
}

export default GroupPage;