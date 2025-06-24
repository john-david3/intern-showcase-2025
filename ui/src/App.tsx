import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GroupPage from "./pages/GroupPage.tsx"
import GroupX from "./pages/GroupX.tsx"
import CreateGroup from "./components/Groups/CreateGroup.tsx"
import JoinGroup from "./components/Groups/JoinGroup.tsx";
import JoinRandomGroup from "./components/Groups/JoinRandomGroup.tsx";
import Home from "./pages/Home.tsx"
import Navbar from "./components/Navbar/Navbar.tsx";
import LoginSignup from "./pages/LoginSignup.tsx";

function App() {
  return (
    <Router>
        <Navbar />
        <section>
            <Routes>
                <Route path="/groups" element={<GroupPage />} />
                <Route path="/group/:gid" element={<GroupX />} />
                <Route path="/create_group" element={<CreateGroup />} />
                <Route path="/join_group" element={<JoinGroup />} />
                <Route path="/join_random_group" element={<JoinRandomGroup />} />
                <Route path="/" element={<Home />} />
                <Route path="/login_signup" element={<LoginSignup />} />
            </Routes>
        </section>
    </Router>
  )
}

export default App
