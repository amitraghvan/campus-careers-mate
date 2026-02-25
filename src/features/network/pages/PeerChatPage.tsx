import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { peerService } from "../services/peer.service";
import { Peer, ChatMessage } from "../types/peer.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MoreVertical, Phone, Video, MessageSquareDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function PeerChatPage() {
    const location = useLocation();
    const state = location.state as { peerId?: string } | null;
    const initialPeerId: string | undefined = state?.peerId;

    const [peers, setPeers] = useState<Peer[]>([]);
    const [selectedPeerId, setSelectedPeerId] = useState<string | null>(initialPeerId ?? null);
    const [messageText, setMessageText] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

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

    // Load chat history whenever selected peer changes
    useEffect(() => {
        if (!selectedPeerId) return;
        setChatHistory([]);
        peerService.getChatHistory(selectedPeerId).then(setChatHistory);
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
            read: false,
        };
        setChatHistory(prev => [...prev, optimistic]);

        try {
            await peerService.sendMessage(selectedPeerId, text);
        } catch (err) {
            console.error("Failed to send message:", err);
            // Revert optimistic message on failure
            setChatHistory(prev => prev.filter(m => m.id !== optimistic.id));
            setMessageText(text); // restore text
        } finally {
            setSending(false);
        }
    };

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
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {chatHistory.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                                    <MessageSquareDashed className="h-10 w-10 opacity-30" />
                                    <p className="text-sm">No messages yet. Say hi! 👋</p>
                                </div>
                            )}
                            {chatHistory.map(msg => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={cn(
                                        "flex w-full",
                                        msg.senderId === "me" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={cn(
                                        "max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                        msg.senderId === "me"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-secondary text-foreground rounded-bl-none"
                                    )}>
                                        {msg.text}
                                        <div className={cn(
                                            "text-[10px] mt-1 text-right opacity-70",
                                            msg.senderId === "me" ? "text-primary-foreground" : "text-muted-foreground"
                                        )}>
                                            {msg.timestamp}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border/50 bg-card/30">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <Input
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
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
