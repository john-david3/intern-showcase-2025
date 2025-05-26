import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SignupForm from "./components/Auth/SignupForm.tsx"
import LoginForm from "./components/Auth/LoginForm.tsx"
import GroupPage from "./pages/GroupPage.tsx"
import CreateGroup from "./components/Groups/CreateGroup.tsx"
import JoinGroup from "./components/Groups/JoinGroup.tsx";

function App() {
  return (
    <Router>
        <nav>
            <Link to="/signup">Signup</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/groups">Group Page</Link> |{" "}
            <Link to="/create_group">Create a Group</Link> |{" "}
            <Link to="/join_group">Join a Group</Link>
        </nav>

        <section>
            <Routes>
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/groups" element={<GroupPage />} />
                <Route path="/create_group" element={<CreateGroup />} />
                <Route path="/join_group" element={<JoinGroup />} />
                <Route path="/" element={<h1>Welcome! Choose a page above.</h1>} />
            </Routes>
        </section>
    </Router>
  )
}

export default App
