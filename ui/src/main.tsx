import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {AuthProvider} from "./contexts/AuthContext.tsx";
import {SocketProvider} from "./contexts/SocketContext.tsx";

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
  </AuthProvider>,
)
