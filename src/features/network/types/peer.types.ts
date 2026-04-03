export type ConnectionStatus = "CONNECT" | "PENDING" | "CONNECTED";

export type OnlineStatus = "online" | "studying" | "focus" | "idle" | "offline";

export interface Peer {
    id: string;
    name: string;
    avatar: string; // Initials or URL
    avatarUrl?: string;
    degree: string;
    college: string;
    batch: string;
    targetRoles: string[];
    skills: string[];
    bio: string;
    status: ConnectionStatus;
    requestId?: string;
    isOnline?: boolean;            // Legacy compatibility field
    // AI-enriched fields
    matchScore?: number;       // 0–100 AI compatibility score
    sharedGoals?: string[];    // Goals in common with current user
    skillOverlap?: string[];   // Shared skills
    consistencyScore?: number; // 0–100 activity consistency
    streak?: number;           // Current daily streak in days
    onlineStatus?: OnlineStatus;
    currentActivity?: string;  // e.g. "Solving DSA", "In focus mode"
    lastActive?: string;       // ISO string
    isAiMatch?: boolean;       // Flagged as top AI pick today
    connectionCount?: number;  // How many peers they have
    section?: "bestMatch" | "activeNow" | "underrated" | "squad";
}

export interface Squad {
    id: string;
    name: string;
    description: string;
    members: number;
    topics: string[];
    matchScore: number;
    avatars: string[]; // initials of first 3 members
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    rawDate: string;
    isRead: boolean;
    isSent: boolean;
}

export interface ChatThread {
    peerId: string;
    lastMessage: ChatMessage;
    unreadCount: number;
}
