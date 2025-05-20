import './App.css'
import SignupForm from "./components/Auth/SignupForm.tsx";
import LoginForm from "./components/Auth/LoginForm.tsx";

function App() {

  return (
    <>
        <section>
            <h1>Test Page</h1>
            <SignupForm />
            <LoginForm />
        </section>
    </>
  )
}

export default App
