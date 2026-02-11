import { Peer, ChatMessage, ChatThread } from "../types/peer.types";

export const MOCK_PEERS: Peer[] = [
    {
        id: "1",
        name: "Rohan Gupta",
        avatar: "RG",
        degree: "B.Tech CSE",
        college: "NIT Trichy",
        batch: "2025",
        targetRoles: ["SDE", "Backend"],
        skills: ["Java", "Spring Boot", "AWS"],
        bio: "Aspiring Backend Engineer 🚀 | LeetCode 500+",
        status: "CONNECT",
        isOnline: true,
    },
    {
        id: "2",
        name: "Priya Sharma",
        avatar: "PS",
        degree: "B.Tech IT",
        college: "VIT Vellore",
        batch: "2026",
        targetRoles: ["Data Analyst", "SDE"],
        skills: ["Python", "SQL", "Tableau"],
        bio: "Data enthusiast. Looking for study buddies.",
        status: "PENDING", // Sent request
        lastActive: "2h ago",
    },
    {
        id: "3",
        name: "Aditya Verma",
        avatar: "AV",
        degree: "B.Tech ECE",
        college: "IIIT Hyderabad",
        batch: "2025",
        targetRoles: ["SDE", "System Design"],
        skills: ["C++", "OS", "Networks"],
        bio: "Cracking FAANG one day at a time.",
        status: "CONNECTED",
        isOnline: true,
    },
    {
        id: "4",
        name: "Sneha Reddy",
        avatar: "SR",
        degree: "M.Tech CSE",
        college: "IIT Madras",
        batch: "2025",
        targetRoles: ["AI/ML Engineer"],
        skills: ["PyTorch", "TensorFlow", "NLP"],
        bio: "Researching LLMs. Let's connect!",
        status: "CONNECT",
        lastActive: "1d ago",
    }
];

export const MOCK_CHATS: Record<string, ChatMessage[]> = {
    "3": [ // Chat with Aditya
        { id: "m1", senderId: "3", text: "Hey! Saw you're also targeting Amazon.", timestamp: "10:30 AM", read: true },
        { id: "m2", senderId: "me", text: "Yeah, preparing for the OA. Any tips?", timestamp: "10:32 AM", read: true },
        { id: "m3", senderId: "3", text: "Focus on DP and Graphs. They ask a lot of those.", timestamp: "10:33 AM", read: true },
    ]
};

export const peerService = {
    getPeers(): Peer[] {
        return MOCK_PEERS;
    },

    getPeerById(id: string): Peer | undefined {
        return MOCK_PEERS.find(p => p.id === id);
    },

    getChatHistory(peerId: string): ChatMessage[] {
        return MOCK_CHATS[peerId] || [];
    },

    sendMessage(peerId: string, text: string): ChatMessage {
        return {
            id: crypto.randomUUID(),
            senderId: "me",
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: true // self message
        };
    }
};
