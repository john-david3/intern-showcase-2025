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

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                            children,
                                                                        }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Check if we already have a socket instance
        if (socketRef.current) {
            console.log("Socket already exists, closing existing socket");
            socketRef.current.close();
        }

        const newSocket = io("http://localhost:5000", {
            path: "/socket.io/",
            transports: ["websocket"],
            withCredentials: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            timeout: 5000,
            autoConnect: true,
            forceNew: true,
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Socket connected!");
            setIsConnected(true);
        });

        newSocket.on("reconnect_attempt", (attemptNumber) => {
            console.log(`Reconnecting... Attempt ${attemptNumber}`);
        });

        newSocket.on("reconnect_error", (error) => {
            console.error("Reconnection error:", error);
        });

        newSocket.on("reconnect", (attemptNumber) => {
            console.log(`Reconnected after ${attemptNumber} attempts!`);
        });

        newSocket.on("reconnect_failed", () => {
            console.error("Reconnection failed. Please refresh the page.");
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            if (newSocket) newSocket.disconnect();
        });

        newSocket.on("disconnect", (reason) => {
            console.log("Socket disconnected! Reason: " + reason);
            setIsConnected(false);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
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