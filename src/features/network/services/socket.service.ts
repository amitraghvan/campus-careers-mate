import { io, Socket } from "socket.io-client";

class SocketService {
    private socket: Socket | null = null;
    private baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    connect() {
        if (this.socket?.connected) return;

        const session = localStorage.getItem("placement-tracker-auth");
        if (!session) return;

        try {
            const { token } = JSON.parse(session);
            this.socket = io(`${this.baseUrl}/chat`, {
                auth: { token },
                transports: ["websocket"],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            this.socket.on("connect", () => {
                console.log("Chat socket connected:", this.socket?.id);
            });

            this.socket.on("connect_error", (err) => {
                console.error("Chat socket connection error:", err.message);
            });

            this.socket.on("disconnect", (reason) => {
                console.log("Chat socket disconnected:", reason);
            });
        } catch (e) {
            console.error("Failed to parse auth token for socket", e);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}

export const socketService = new SocketService();
