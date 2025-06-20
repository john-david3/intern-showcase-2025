import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SignupForm from "./components/Auth/SignupForm.tsx"
import LoginForm from "./components/Auth/LoginForm.tsx"
import GroupPage from "./pages/GroupPage.tsx"
import GroupX from "./pages/GroupX.tsx"
import CreateGroup from "./components/Groups/CreateGroup.tsx"
import JoinGroup from "./components/Groups/JoinGroup.tsx";
import JoinRandomGroup from "./components/Groups/JoinRandomGroup.tsx";
import ChatForm from "./components/Chat/Chat.tsx";
import {SocketProvider} from "./contexts/SocketContext.tsx";

function App() {
  return (
    <Router>
        <nav>
            <Link to="/signup">Signup</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/groups">Group Page</Link> |{" "}
            <Link to="/create_group">Create a Group</Link> |{" "}
            <Link to="/join_group">Join a Group</Link> |{" "}
            <Link to="/join_random_group">Join a Random Group</Link> |{" "}
            <Link to="/chat">Chat</Link>
        </nav>

        <section>
            <Routes>
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/groups" element={<GroupPage />} />
                <Route path="/group/:gid" element={<GroupX />} />
                <Route path="/create_group" element={<CreateGroup />} />
                <Route path="/join_group" element={<JoinGroup />} />
                <Route path="/join_random_group" element={<JoinRandomGroup />} />
                <Route path="/chat" element={<SocketProvider><ChatForm groupId={''} /></SocketProvider>} />
                <Route path="/" element={<h1>Welcome! Choose a page above.</h1>} />
            </Routes>
        </section>
    </Router>
  )
}

export default App
