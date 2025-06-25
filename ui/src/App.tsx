import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GroupPage from "./pages/GroupPage.tsx"
import Home from "./pages/Home.tsx"
import Navbar from "./components/Navbar/Navbar.tsx";
import LoginSignup from "./pages/LoginSignup.tsx";
import GroupX from "./pages/GroupX.tsx";

function App() {
  return (
    <Router>
        <Navbar />
        <section>
            <Routes>
                <Route path="/groups" element={<GroupPage />} />
                <Route path="/" element={<Home />} />
                <Route path="/login_signup" element={<LoginSignup />} />
                <Route path="/group/:gid" element={<GroupX />} />
            </Routes>
        </section>
    </Router>
  )
}

export default App