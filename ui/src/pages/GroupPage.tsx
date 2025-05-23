import {useEffect} from "react";
import {useAuth} from "../contexts/AuthContext.tsx";


const GroupPage = () => {
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8080/api/get_groups", {
                    credentials: "include"
                });
                if (!response.ok){
                    throw new Error("Failed to fetch groups");
                }
                const data = await response.json();
                console.log(data);
                // TODO: format this data nicely on the frontend

            } catch (error) {
                console.error("Error fetching groups: ", error);
            }
        }

        if (isLoggedIn){
            fetchUserGroups()
        }

    }, [isLoggedIn]);


    return (
        <section>
            <h2>My Groups</h2>

        </section>
    )
}

export default GroupPage;