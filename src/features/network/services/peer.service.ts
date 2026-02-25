import { Peer, ChatMessage, ChatThread } from "../types/peer.types";
import { api } from "@/lib/api";

// Module-level cache for getPeerById lookups
let peerCache: Peer[] = [];

// Helper to generate initials from a name (e.g. "John Doe" -> "JD")
const getInitials = (name: string): string => {
    if (!name || name === "Unknown") return "??";
    return name
        .split(" ")
        .filter(Boolean)
        .map(part => part[0].toUpperCase())
        .slice(0, 2)
        .join("");
};

// Backend response types
interface BackendProfile {
    userId?: string;
    id?: string;
    user?: { id?: string; name?: string; avatarUrl?: string };
    name?: string;
    avatarUrl?: string;
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
const mapProfileToPeer = (p: BackendProfile, status: Peer['status'] = "CONNECT"): Peer => {
    const name = p.user?.name || p.name || "Unknown";
    return {
        id: p.userId || p.user?.id || p.id || "",
        name,
        avatar: getInitials(name),
        degree: "Student",
        college: p.college || "Unknown",
        batch: "2025",
        targetRoles: p.targetJobRoles || [],
        skills: [],
        bio: p.headline || "",
        status,
        isOnline: false
    };
};

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
                        avatar: getInitials(other.name),
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
                        avatar: getInitials(requester.name),
                        degree: "Student",
                        college: requester.college || "Unknown",
                        batch: "2025",
                        targetRoles: [],
                        skills: [],
                        bio: "Incoming Request",
                        status: "PENDING",
                        requestId: c.id
                    });
                }
            });

            // Update the module-level cache
            peerCache = peers;
            return peers;
        } catch (e) {
            console.error("Failed to fetch peers", e);
            return [];
        }
    },

    getPeerById(id: string): Peer | undefined {
        return peerCache.find(p => p.id === id);
    },

    async sendConnectionRequest(userId: string) {
        return api.post(`/peers/connections/request/${userId}`, {});
    },

    async acceptConnectionRequest(requestId: string) {
        return api.patch(`/peers/connections/accept/${requestId}`, {});
    },

    async getChatHistory(peerId: string): Promise<ChatMessage[]> {
        try {
            // Get or create conversation for this peer
            const conv = await api.post<{ id: string }>(`/chats/conversation/${peerId}`, {});
            const conversationId = conv.id;

            const session = localStorage.getItem("placement-tracker-auth");
            const myId = session ? JSON.parse(session).user.id : "";

            const messages = await api.get<BackendMessage[]>(`/chats/${conversationId}/messages`);
            return messages.map((m) => ({
                id: m.id,
                senderId: m.senderId === myId ? "me" : m.senderId,
                text: m.content,
                timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                rawDate: new Date(m.createdAt).toISOString(),
                isRead: true, // we assume existing history is read for now
                isSent: true,
            }));
        } catch (e) {
            console.error("Failed to get chat", e);
            return [];
        }
    },

    async sendMessage(peerId: string, text: string): Promise<ChatMessage> {
        // Always get-or-create the conversation first (works even before connection accepted)
        const conv = await api.post<{ id: string }>(`/chats/conversation/${peerId}`, {});
        const conversationId = conv.id;

        await api.post<BackendMessage>(`/chats/${conversationId}/messages`, {
            content: text
        });

        return {
            id: `temp-${Date.now()}`,
            senderId: "me",
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            rawDate: new Date().toISOString(),
            isRead: false,
            isSent: true,
        };
    }
};
