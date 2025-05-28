import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AuthCheck = () => {
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    async function checkSession() {
      try {
        console.log("Checking status...")
        const response = await fetch("http://localhost:5000/session_status", {
          credentials: "include", // important for cookies to be sent
        });
        const data = await response.json();
        console.log("Status Checked: ", data);
        setIsLoggedIn(data.logged_in);
      } catch (error) {
        setIsLoggedIn(false);
      }
    }
    checkSession();
  }, [setIsLoggedIn]);

  return null;
};

export default AuthCheck;
