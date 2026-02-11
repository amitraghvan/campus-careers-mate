import { useState, useRef, useEffect } from "react";
import { peerService } from "../services/peer.service";
import { Peer, ChatMessage } from "../types/peer.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function PeerChatPage() {
    const [peers, setPeers] = useState<Peer[]>([]);
    const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const loadPeers = async () => {
            const allPeers = await peerService.getPeers();
            const connected = allPeers.filter(p => p.status === "CONNECTED");
            setPeers(connected);
            if (connected.length > 0 && !selectedPeerId) {
                setSelectedPeerId(connected[0].id);
            }
        };
        loadPeers();
    }, [selectedPeerId]);

    const activePeer = selectedPeerId ? peers.find(p => p.id === selectedPeerId) : null;

    useEffect(() => {
        if (selectedPeerId) {
            peerService.getChatHistory(selectedPeerId).then(setChatHistory);
        }
    }, [selectedPeerId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedPeerId) return;

        try {
            const newMsg = await peerService.sendMessage(selectedPeerId, messageText);
            setChatHistory(prev => [...prev, newMsg]);
            setMessageText("");
        } catch (e) {
            console.error("Failed to send", e);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex border border-border/50 rounded-2xl overflow-hidden bg-card shadow-sm">
            {/* Sidebar */}
            <div className="w-80 border-r border-border/50 flex flex-col bg-secondary/5">
                <div className="p-4 border-b border-border/50">
                    <h2 className="font-semibold">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
                                    {/* Mock timestamp */}
                                    <span className="text-[10px] text-muted-foreground opacity-70">10:30 AM</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{peer.bio}</p>
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
                                        {activePeer.isOnline ? (
                                            <>
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Online
                                            </>
                                        ) : "Offline"}
                                        <span className="text-border">|</span>
                                        {activePeer.degree} @ {activePeer.college}
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
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border/50 bg-card/30">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <Input
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder={`Message ${activePeer.name.split(' ')[0]}...`}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={!messageText.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
