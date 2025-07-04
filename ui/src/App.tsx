import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GroupPage from "./pages/GroupPage.tsx"
import GroupX from "./pages/GroupX.tsx";
import Home from "./pages/Home.tsx"
import Navbar from "./components/Navbar/Navbar.tsx";
import LoginSignup from "./pages/LoginSignup.tsx";
import CreateGroup from "./components/Groups/CreateGroup.tsx"
import JoinGroup from "./components/Groups/JoinGroup.tsx";
import JoinRandomGroup from "./components/Groups/JoinRandomGroup.tsx";
import ChatForm from "./components/Chat/ChatForm.tsx";
import {SocketProvider} from "./contexts/SocketContext.tsx";
import Profile from "./pages/Profile.tsx";
import {useState} from "react";
import AuthCheck from "./components/Auth/AuthCheck.tsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
      <>
          <AuthCheck setIsLoggedIn={setIsLoggedIn} />
          <Router>
              <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
              <section>
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/groups" element={<GroupPage />} />
                      <Route path="/group/:gid" element={<GroupX />} />
                      <Route path="/login_signup" element={<LoginSignup />} />
                      <Route path="/create_group" element={<CreateGroup />} />
                      <Route path="/join_group" element={<JoinGroup />} />
                      <Route path="/join_random_group" element={<JoinRandomGroup />} />
                      <Route path="/chat" element={<SocketProvider><ChatForm groupId={''} /></SocketProvider>} />
                      <Route path="/profile" element={<Profile />} />
                  </Routes>
              </section>
          </Router>
      </>
  )
}

export default App
