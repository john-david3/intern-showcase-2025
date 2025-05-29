export async function getOptions(groupId: string, data: string){
    const body_data = {
        "groupId": groupId,
        "data": data
    }

    try {
            const response = await fetch("http://localhost:5000/get_options", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(body_data),
            });

            const data = await response.json();
            if (data.option_added){
                console.log("Retrieved options")
                return data
            } else {
                console.log("Options could not be retrieved");
            }

        } catch (error) {
            console.error("Error fetching options");
        }
}