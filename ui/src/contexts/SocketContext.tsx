import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Check if we already have a socket instance
        if (socketRef.current) {
            console.log("Socket already exists, closing existing socket");
            socketRef.current.disconnect();
        }

        const socket = io("http://localhost:5000", {
            withCredentials: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            timeout: 5000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected!");
            setIsConnected(true);
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected! Reason: " + reason);
            setIsConnected(false);
        });

        return () => {
            socket.off();
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};