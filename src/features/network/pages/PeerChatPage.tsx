import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { peerService } from "../services/peer.service";
import { socketService } from "../services/socket.service";
import { Peer, ChatMessage } from "../types/peer.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MoreVertical, Phone, Video, MessageSquareDashed, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Helper to check if date is today or yesterday
const formatDateLabel = (isoDate: string) => {
    const date = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
};

export default function PeerChatPage() {
    const location = useLocation();
    const state = location.state as { peerId?: string } | null;
    const initialPeerId: string | undefined = state?.peerId;

    const [peers, setPeers] = useState<Peer[]>([]);
    const [selectedPeerId, setSelectedPeerId] = useState<string | null>(initialPeerId ?? null);
    const [messageText, setMessageText] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [sending, setSending] = useState(false);
    const [isPeerTyping, setIsPeerTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const conversationIdRef = useRef<string | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load ALL peers (not just connected) so anyone can be messaged
    useEffect(() => {
        const loadPeers = async () => {
            const allPeers = await peerService.getPeers();
            setPeers(allPeers);
            // Auto-select first peer if none chosen
            if (!selectedPeerId && allPeers.length > 0) {
                setSelectedPeerId(allPeers[0].id);
            }
        };
        loadPeers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount only

    const activePeer = selectedPeerId ? peers.find(p => p.id === selectedPeerId) : null;

    // Connect to sockets on mount
    useEffect(() => {
        socketService.connect();
        return () => {
            socketService.disconnect();
        };
    }, []);

    // Load chat history whenever selected peer changes
    useEffect(() => {
        if (!selectedPeerId) return;
        setIsPeerTyping(false); // reset typing if switching

        const loadHistoryAndJoin = async () => {
            setChatHistory([]); // Clear immediately for UX

            // 1. Get history and implicit conversation creation
            const history = await peerService.getChatHistory(selectedPeerId);
            setChatHistory(history);

            // 2. Fetch the newly created (or existing) conversation ID directly from API
            // (Normally would return this from getChatHistory, but we'll fetch explicitly to be safe, 
            // or we extract it if we had a dedicated getConversation api. To keep it simple without adding a new route:
            // Since `sendMessage` implicitly creates, we know getChatHistory creates it
            // We'll rely on a small trick or just use the backend to fetch all)
            // Let's get the conversations from backend to find the ID.
            const session = localStorage.getItem("placement-tracker-auth");
            if (session) {
                const myId = JSON.parse(session).user.id;
                // Since getChatHistory is mapped, we need the raw convo ID to join the socket room.
                // We will modify the getChatHistory return signature later to avoid an extra call if needed, 
                // but for now, let's grab the conv via native fetch.
                const convRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/chats/conversation/${selectedPeerId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${JSON.parse(session).token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                });
                const convData = await convRes.json();

                if (convData?.id) {
                    conversationIdRef.current = convData.id;
                    const socket = socketService.getSocket();
                    if (socket) {
                        socket.emit("joinConversation", convData.id);
                        // Emit read immediately
                        socket.emit("message:read", convData.id);
                    }
                }
            }
        };

        loadHistoryAndJoin();
    }, [selectedPeerId]);

    // Handle incoming socket events
    useEffect(() => {
        const socket = socketService.getSocket();
        if (!socket) return;

        const handleReceive = (msg: { id: string; senderId: string; content: string; createdAt: string; conversationId: string }) => {
            // Check if it belongs to current active peer view
            if (msg.conversationId === conversationIdRef.current) {
                const formatted: ChatMessage = {
                    id: msg.id,
                    senderId: msg.senderId, // assume not me if received here usually
                    text: msg.content,
                    timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    rawDate: new Date(msg.createdAt).toISOString(),
                    isRead: true, // viewed immediately
                    isSent: true,
                };
                setChatHistory(prev => [...prev, formatted]);

                // Immediately mark as read
                socket.emit("message:read", msg.conversationId);
            }
        };

        const handleReadUpdate = (data: { conversationId: string; readerId: string }) => {
            if (data.conversationId === conversationIdRef.current) {
                // Update all my msgs to isRead = true
                setChatHistory(prev => prev.map(m =>
                    m.senderId === "me" ? { ...m, isRead: true } : m
                ));
            }
        };

        const handleTypingStart = (data: { userId: string; conversationId: string }) => {
            if (data.conversationId === conversationIdRef.current && data.userId === selectedPeerId) {
                setIsPeerTyping(true);
            }
        };

        const handleTypingStop = (data: { userId: string; conversationId: string }) => {
            if (data.conversationId === conversationIdRef.current && data.userId === selectedPeerId) {
                setIsPeerTyping(false);
            }
        };

        socket.on("message:receive", handleReceive);
        socket.on("message:read:update", handleReadUpdate);
        socket.on("typing:start", handleTypingStart);
        socket.on("typing:stop", handleTypingStop);

        return () => {
            socket.off("message:receive", handleReceive);
            socket.off("message:read:update", handleReadUpdate);
            socket.off("typing:start", handleTypingStart);
            socket.off("typing:stop", handleTypingStop);
        };
    }, [selectedPeerId]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedPeerId || sending) return;
        const text = messageText.trim();
        setMessageText("");
        setSending(true);

        // Optimistic update
        const optimistic: ChatMessage = {
            id: `opt-${Date.now()}`,
            senderId: "me",
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            rawDate: new Date().toISOString(),
            isRead: false,
            isSent: false,
        };
        setChatHistory(prev => [...prev, optimistic]);

        // Stop typing immediately
        const socket = socketService.getSocket();
        if (socket && conversationIdRef.current) {
            socket.emit("typing:stop", conversationIdRef.current);
        }

        try {
            // Using socket emit directly for real-time delivery
            if (socket && conversationIdRef.current) {
                socket.emit("message:send", {
                    conversationId: conversationIdRef.current,
                    content: text
                }, (response: unknown) => {
                    // Check ack or just rely on optimism
                    setChatHistory(prev => prev.map(m => m.id === optimistic.id ? { ...m, isSent: true } : m));
                });
            } else {
                // Fallback to REST
                await peerService.sendMessage(selectedPeerId, text);
                setChatHistory(prev => prev.map(m => m.id === optimistic.id ? { ...m, isSent: true } : m));
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            // Revert optimistic message on failure
            setChatHistory(prev => prev.filter(m => m.id !== optimistic.id));
            setMessageText(text); // restore text
        } finally {
            setSending(false);
        }
    };

    const handleInputTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);

        const socket = socketService.getSocket();
        if (!socket || !conversationIdRef.current) return;

        socket.emit("typing:start", conversationIdRef.current);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("typing:stop", conversationIdRef.current);
        }, 2000);
    };

    // Group messages by Date safely
    const groupedMessages = useMemo(() => {
        const groups: { label: string, messages: ChatMessage[] }[] = [];
        let currentGroupLabel = "";

        chatHistory.forEach(msg => {
            const label = formatDateLabel(msg.rawDate);
            if (label !== currentGroupLabel) {
                currentGroupLabel = label;
                groups.push({ label, messages: [msg] });
            } else {
                groups[groups.length - 1].messages.push(msg);
            }
        });
        return groups;
    }, [chatHistory]);

    return (
        <div className="h-[calc(100vh-140px)] flex border border-border/50 rounded-2xl overflow-hidden bg-card shadow-sm">
            {/* Sidebar — all peers */}
            <div className="w-80 border-r border-border/50 flex flex-col bg-secondary/5">
                <div className="p-4 border-b border-border/50">
                    <h2 className="font-semibold">Messages</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Message anyone on the platform</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {peers.length === 0 && (
                        <p className="text-xs text-center text-muted-foreground py-8">No users found</p>
                    )}
                    {peers.map(peer => (
                        <button
                            key={peer.id}
                            onClick={() => setSelectedPeerId(peer.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                                selectedPeerId === peer.id ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                            )}
                        >
                            <div className="relative">
                                <Avatar className="h-10 w-10 border border-border/50">
                                    <AvatarFallback>{peer.avatar}</AvatarFallback>
                                </Avatar>
                                {peer.isOnline && (
                                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-medium truncate">{peer.name}</span>
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-1 shrink-0",
                                        peer.status === "CONNECTED"
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-secondary text-muted-foreground"
                                    )}>
                                        {peer.status === "CONNECTED" ? "Connected" : peer.status === "PENDING" ? "Pending" : ""}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{peer.college}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-background">
                {activePeer ? (
                    <>
                        {/* Header */}
                        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{activePeer.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-sm leading-none">{activePeer.name}</h3>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                        {activePeer.college}
                                        {activePeer.status === "CONNECTED" && (
                                            <><span className="text-border">|</span><span className="text-green-400">Connected</span></>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {chatHistory.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                                    <MessageSquareDashed className="h-10 w-10 opacity-30" />
                                    <p className="text-sm">No messages yet. Say hi! 👋</p>
                                </div>
                            )}

                            {groupedMessages.map((group, gIdx) => (
                                <div key={gIdx} className="space-y-4">
                                    {/* Date Separator */}
                                    <div className="flex justify-center">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                                            {group.label}
                                        </span>
                                    </div>

                                    {group.messages.map(msg => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg.id}
                                            className={cn(
                                                "flex w-full group",
                                                msg.senderId === "me" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "max-w-[70%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed relative",
                                                msg.senderId === "me"
                                                    ? "bg-primary text-primary-foreground rounded-br-none shadow-md shadow-primary/20"
                                                    : "bg-secondary/60 text-foreground rounded-bl-none shadow-sm border border-border/40"
                                            )}>
                                                <p className="whitespace-pre-wrap break-words pr-8">
                                                    {msg.text}
                                                </p>
                                                <div className={cn(
                                                    "text-[10px] mt-1 flex items-center justify-end gap-1 absolute bottom-1.5 right-3",
                                                    msg.senderId === "me" ? "text-primary-foreground/80" : "text-muted-foreground/80"
                                                )}>
                                                    <span>{msg.timestamp}</span>
                                                    {msg.senderId === "me" && (
                                                        <span className="flex items-center">
                                                            {!msg.isSent ? (
                                                                <span className="opacity-50 text-[8px] animate-pulse">Wait</span>
                                                            ) : msg.isRead ? (
                                                                <CheckCheck className="h-3 w-3 text-blue-300 ml-0.5" />
                                                            ) : (
                                                                <Check className="h-3 w-3 ml-0.5 opacity-70" />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ))}

                            <AnimatePresence>
                                {isPeerTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-secondary/40 text-muted-foreground px-4 py-3 rounded-2xl rounded-bl-none text-sm flex items-center gap-1.5 w-fit">
                                            <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={bottomRef} className="h-1" />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border/50 bg-card/30">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <Input
                                    value={messageText}
                                    onChange={handleInputTyping}
                                    placeholder={`Message ${activePeer.name.split(' ')[0]}...`}
                                    className="flex-1"
                                    disabled={sending}
                                />
                                <Button type="submit" size="icon" disabled={!messageText.trim() || sending}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <MessageSquareDashed className="h-12 w-12 opacity-20" />
                        <p>Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
