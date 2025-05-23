import './App.css'
import SignupForm from "./components/Auth/SignupForm.tsx";
import LoginForm from "./components/Auth/LoginForm.tsx";
import GroupPage from "./pages/GroupPage.tsx";

function App() {

  return (
    <>
        <section>
            <h1>Test Page</h1>
            <SignupForm />
            <LoginForm />
            <GroupPage />
        </section>
    </>
  )
}

export default App
