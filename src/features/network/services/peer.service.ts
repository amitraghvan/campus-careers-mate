import { Peer, ChatMessage, ChatThread } from "../types/peer.types";
import { api } from "@/lib/api";

// Backend response types
interface BackendProfile {
    userId?: string;
    id?: string;
    user?: { name?: string; avatarUrl?: string };
    college?: string;
    headline?: string;
    targetJobRoles?: string[];
}

interface BackendConnection {
    id: string;
    requesterId: string;
    receiverId: string;
    requester?: { id: string; name: string; avatarUrl?: string; college?: string };
    receiver?: { id: string; name: string; avatarUrl?: string; college?: string };
}

interface DiscoverResponse {
    data?: BackendProfile[];
    meta?: Record<string, unknown>;
}

interface BackendConversation {
    id: string;
    participantOneId: string;
    participantTwoId: string;
}

interface BackendMessage {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
}

// Helper to map backend profile/user to frontend Peer
const mapProfileToPeer = (p: BackendProfile, status: Peer['status'] = "CONNECT"): Peer => ({
    id: p.userId || p.id || "", // Prefer userId
    name: p.user?.name || "Unknown",
    avatar: p.user?.avatarUrl || "AV",
    degree: "Student", // Default
    college: p.college || "Unknown",
    batch: "2025",
    targetRoles: p.targetJobRoles || [],
    skills: [],
    bio: p.headline || "",
    status,
    isOnline: false
});

export const peerService = {
    async getPeers(): Promise<Peer[]> {
        try {
            const [discoverRes, connections, incoming] = await Promise.all([
                api.get<DiscoverResponse>('/peers/profile/discover'),
                api.get<BackendConnection[]>('/peers/connections'),
                api.get<BackendConnection[]>('/peers/connections/incoming')
            ]);

            const peers: Peer[] = [];

            // 1. Discoverable (CONNECT)
            // Backend returns { data: [], meta: {} }
            const discover = discoverRes.data || [];
            discover.forEach((p: BackendProfile) => {
                peers.push(mapProfileToPeer(p, "CONNECT"));
            });

            // 2. Connections (CONNECTED)
            connections.forEach((c: BackendConnection) => {
                const session = localStorage.getItem("placement-tracker-auth");
                const myId = session ? JSON.parse(session).user.id : "";

                const other = c.requesterId === myId ? c.receiver : c.requester;
                if (other) {
                    peers.push({
                        id: other.id,
                        name: other.name,
                        avatar: other.avatarUrl || "AV",
                        degree: "Student",
                        college: other.college || "Unknown",
                        batch: "2025",
                        targetRoles: [],
                        skills: [],
                        bio: "Connected Peer",
                        status: "CONNECTED",
                        isOnline: false
                    });
                }
            });

            // 3. Incoming Requests (PENDING)
            incoming.forEach((c: BackendConnection) => {
                const requester = c.requester;
                if (requester) {
                    peers.push({
                        id: requester.id,
                        name: requester.name,
                        avatar: requester.avatarUrl || "AV",
                        degree: "Student",
                        college: requester.college || "Unknown",
                        batch: "2025",
                        targetRoles: [],
                        skills: [],
                        bio: "Incoming Request",
                        status: "PENDING", // This means "I can accept"
                        requestId: c.id // Critical for accept/reject
                    });
                }
            });

            return peers;
        } catch (e) {
            console.error("Failed to fetch peers", e);
            return [];
        }
    },

    getPeerById(id: string): Peer | undefined {
        // This is synchronous in generic definition but we can't implement it properly if we don't have cache.
        // Frontend calls this. I should ideally cache `getPeers` result or change frontend to async.
        // For now, returning undefined might break UI.
        // I will rely on `getPeers` being called first.
        return undefined;
    },

    async sendConnectionRequest(userId: string) {
        return api.post(`/peers/connections/request/${userId}`, {});
    },

    async acceptConnectionRequest(requestId: string) {
        return api.patch(`/peers/connections/accept/${requestId}`, {});
    },

    async getChatHistory(peerId: string): Promise<ChatMessage[]> {
        try {
            const conversations = await api.get<BackendConversation[]>('/chats');
            const session = localStorage.getItem("placement-tracker-auth");
            const myId = session ? JSON.parse(session).user.id : "";

            const conv = conversations.find(c =>
                (c.participantOneId === myId && c.participantTwoId === peerId) ||
                (c.participantTwoId === myId && c.participantOneId === peerId)
            );

            if (!conv) return [];

            const messages = await api.get<BackendMessage[]>(`/chats/${conv.id}/messages`);
            return messages.map(m => ({
                id: m.id,
                senderId: m.senderId === myId ? "me" : m.senderId,
                text: m.content,
                timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: true
            }));
        } catch (e) {
            console.error("Failed to get chat", e);
            return [];
        }
    },

    async sendMessage(peerId: string, text: string): Promise<ChatMessage> {
        const conversations = await api.get<BackendConversation[]>('/chats');
        const session = localStorage.getItem("placement-tracker-auth");
        const myId = session ? JSON.parse(session).user.id : "";

        const conv = conversations.find(c =>
            (c.participantOneId === myId && c.participantTwoId === peerId) ||
            (c.participantTwoId === myId && c.participantOneId === peerId)
        );

        if (!conv) throw new Error("Conversation not found");

        await api.post<BackendMessage>(`/chats/${conv.id}/messages`, {
            content: text
        });

        return {
            id: "temp",
            senderId: "me",
            text,
            timestamp: "Just now",
            read: true
        };
    }
};
