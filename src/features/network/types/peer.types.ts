export type ConnectionStatus = "CONNECT" | "PENDING" | "CONNECTED";

export interface Peer {
    id: string;
    name: string;
    avatar: string; // Initials or URL
    degree: string;
    college: string;
    batch: string; // e.g. "2026"
    targetRoles: string[]; // e.g. ["SDE", "Data Analyst"]
    skills: string[];
    bio: string; // Short 1-line headline
    status: ConnectionStatus;
    requestId?: string; // For pending requests
    isOnline?: boolean;
    lastActive?: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    rawDate: string; // for grouping
    isRead: boolean;
    isSent: boolean; // false = sending, true = backend received
}

export interface ChatThread {
    peerId: string;
    lastMessage: ChatMessage;
    unreadCount: number;
}
