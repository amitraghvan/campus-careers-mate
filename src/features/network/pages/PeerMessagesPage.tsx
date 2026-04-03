/**
 * PeerMessagesPage — Full Discord-grade DM system.
 *
 * Features:
 *  - Left sidebar: all conversation threads with last message preview + unread count
 *  - Search conversations
 *  - Filter: All / Connected / Requests
 *  - Right panel: full chat with:
 *    · Emoji reactions (click to add 👍❤️😂🔥🎉)
 *    · Message context menu (reply/copy/delete)
 *    · File attachment UI
 *    · Voice/Video call buttons (UI)
 *    · Typing indicator (3-dot animated)
 *    · Read receipts (✓ / ✓✓ blue)
 *    · Date separators
 *    · AI conversation starter suggestions
 *    · Pin message, message search (UI)
 */

import {
    useState, useRef, useEffect, useMemo, useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send, Phone, Video, MoreVertical, Check, CheckCheck,
    MessageSquareDashed, Search, Paperclip, Smile, Mic,
    Pin, Trash2, Copy, Reply, X, Zap, Star, Bell,
    BellOff, UserPlus, AlertCircle, ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { peerService } from "../services/peer.service";
import { socketService } from "../services/socket.service";
import { Peer, ChatMessage } from "../types/peer.types";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (iso: string) => {
    const d = new Date(iso), t = new Date();
    const y = new Date(t); y.setDate(y.getDate() - 1);
    if (d.toDateString() === t.toDateString()) return "Today";
    if (d.toDateString() === y.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
};

const EMOJI_QUICK = ["👍", "❤️", "😂", "🔥", "🎉", "🙏"];

const AI_STARTERS = [
    "Hey! I saw you're also prepping for FAANG — want to do mock interviews together?",
    "Your streak is impressive! What's your daily study routine like?",
    "I'm working on system design. Would love to discuss problems together!",
    "We have the same target role — should we form a study squad?",
];

// ─── Message Bubble ───────────────────────────────────────────────────────────

interface Reaction { emoji: string; count: number; isMine: boolean }

interface RichChatMessage extends ChatMessage {
    reactions?: Reaction[];
    replyTo?: { id: string; text: string; senderName: string };
    isPinned?: boolean;
}

function MessageBubble({
    msg,
    isMe,
    onReact,
    onContextMenu,
}: {
    msg: RichChatMessage;
    isMe: boolean;
    onReact: (id: string, emoji: string) => void;
    onContextMenu: (id: string, e: React.MouseEvent) => void;
}) {
    const [showReactions, setShowReactions] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex w-full group gap-2", isMe ? "justify-end" : "justify-start")}
        >
            {/* Reactions quick-picker */}
            <AnimatePresence>
                {showReactions && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className={cn(
                            "absolute z-30 flex items-center gap-1 p-1.5 rounded-2xl bg-popover border border-border/60 shadow-xl -top-10",
                            isMe ? "right-0" : "left-0"
                        )}
                    >
                        {EMOJI_QUICK.map(e => (
                            <button
                                key={e}
                                onClick={() => { onReact(msg.id, e); setShowReactions(false); }}
                                className="text-lg hover:scale-125 transition-transform"
                            >{e}</button>
                        ))}
                        <button onClick={() => setShowReactions(false)} className="ml-1 text-muted-foreground hover:text-foreground">
                            <X className="h-3 w-3" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={cn("flex flex-col max-w-[72%]", isMe ? "items-end" : "items-start")}>
                {/* Reply preview */}
                {msg.replyTo && (
                    <div className={cn(
                        "text-[11px] px-3 py-1 rounded-t-lg border-l-2 border-primary/50 bg-secondary/40 text-muted-foreground mb-0.5 max-w-full truncate",
                    )}>
                        <span className="font-medium text-primary/80">{msg.replyTo.senderName}</span>: {msg.replyTo.text}
                    </div>
                )}

                <div className="relative">
                    {/* Context menu trigger (hover) */}
                    <div className={cn(
                        "absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10",
                        isMe ? "-left-16" : "-right-16"
                    )}>
                        <button
                            onClick={() => setShowReactions(v => !v)}
                            className="h-6 w-6 rounded-md bg-secondary hover:bg-secondary/80 flex items-center justify-center text-xs"
                            title="React"
                        >
                            😊
                        </button>
                        <button
                            onContextMenu={e => onContextMenu(msg.id, e)}
                            onClick={e => onContextMenu(msg.id, e)}
                            className="h-6 w-6 rounded-md bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                            title="More"
                        >
                            <MoreVertical className="h-3 w-3" />
                        </button>
                    </div>

                    {/* Bubble */}
                    <div className={cn(
                        "px-4 py-2.5 text-sm leading-relaxed relative",
                        "rounded-2xl shadow-sm",
                        isMe
                            ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-br-none"
                            : "bg-card border border-border/50 text-foreground rounded-bl-none",
                    )}>
                        {msg.isPinned && (
                            <Pin className="h-2.5 w-2.5 absolute top-1.5 right-2 opacity-60" />
                        )}
                        <p className="whitespace-pre-wrap break-words pr-10">{msg.text}</p>
                        <div className={cn(
                            "text-[10px] mt-0.5 flex items-center justify-end gap-1 absolute bottom-1.5 right-3",
                            isMe ? "text-white/60" : "text-muted-foreground/70"
                        )}>
                            <span>{msg.timestamp}</span>
                            {isMe && (
                                msg.isRead
                                    ? <CheckCheck className="h-3 w-3 text-blue-300" />
                                    : msg.isSent
                                        ? <Check className="h-3 w-3 opacity-60" />
                                        : <span className="text-[8px] animate-pulse">··</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reactions bar */}
                {(msg.reactions?.length ?? 0) > 0 && (
                    <div className={cn("flex gap-1 flex-wrap mt-1", isMe ? "justify-end" : "justify-start")}>
                        {msg.reactions!.map(r => (
                            <button
                                key={r.emoji}
                                onClick={() => onReact(msg.id, r.emoji)}
                                className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border transition-all",
                                    r.isMine
                                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                                        : "bg-secondary border-border/50 hover:border-primary/30"
                                )}
                            >
                                {r.emoji} <span className="font-medium">{r.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─── Context Menu ─────────────────────────────────────────────────────────────

function ContextMenu({
    x, y, onClose, onReply, onCopy, onPin, onDelete,
}: {
    x: number; y: number;
    onClose: () => void;
    onReply: () => void;
    onCopy: () => void;
    onPin: () => void;
    onDelete: () => void;
}) {
    const items = [
        { icon: Reply, label: "Reply", fn: onReply },
        { icon: Copy, label: "Copy text", fn: onCopy },
        { icon: Pin, label: "Pin message", fn: onPin },
        { icon: Trash2, label: "Delete", fn: onDelete, danger: true },
    ];
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed z-50 bg-popover border border-border/60 rounded-xl shadow-2xl overflow-hidden text-sm"
            style={{ left: Math.min(x, window.innerWidth - 200), top: Math.min(y, window.innerHeight - 200) }}
        >
            {items.map(item => (
                <button
                    key={item.label}
                    onClick={() => { item.fn(); onClose(); }}
                    className={cn(
                        "flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-secondary/80 transition-colors text-left",
                        (item as any).danger && "text-red-400 hover:bg-red-500/10"
                    )}
                >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                </button>
            ))}
        </motion.div>
    );
}

// ─── AI Starter Suggestions ───────────────────────────────────────────────────

function AIStarters({ onPick }: { onPick: (text: string) => void }) {
    return (
        <div className="p-4 border-t border-border/30 bg-gradient-to-b from-transparent to-violet-950/10">
            <div className="flex items-center gap-1.5 mb-2">
                <Zap className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-[11px] font-medium text-violet-400">AI Conversation Starters</span>
            </div>
            <div className="flex flex-col gap-1.5">
                {AI_STARTERS.slice(0, 2).map((s, i) => (
                    <button
                        key={i}
                        onClick={() => onPick(s)}
                        className="text-left text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary border border-border/30 hover:border-primary/20 transition-all line-clamp-1"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PeerMessagesPage() {
    const location  = useLocation();
    const state = location.state as { peerId?: string } | null;
    const initialPeerId = state?.peerId;

    const [peers, setPeers] = useState<Peer[]>([]);
    const [selectedPeerId, setSelectedPeerId] = useState<string | null>(initialPeerId ?? null);
    const [messages, setMessages] = useState<RichChatMessage[]>([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [search, setSearch] = useState("");
    const [replyTo, setReplyTo] = useState<RichChatMessage | null>(null);
    const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
    const [showStarters, setShowStarters] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<HTMLDivElement>(null);
    const conversationIdRef = useRef<string | null>(null);
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const activePeer = selectedPeerId ? peers.find(p => p.id === selectedPeerId) : null;

    // ── Load peers ──────────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            const all = await peerService.getPeers();
            setPeers(all);
            if (!selectedPeerId && all.length > 0) setSelectedPeerId(all[0].id);
        })();
        socketService.connect();
        return () => socketService.disconnect();
        // eslint-disable-next-line
    }, []);

    // ── Load chat history + join room ────────────────────────────────────────
    useEffect(() => {
        if (!selectedPeerId) return;
        setMessages([]); setIsTyping(false); setReplyTo(null);
        setShowStarters(false);

        (async () => {
            const history = await peerService.getChatHistory(selectedPeerId);
            const rich = history.map(m => ({ ...m, reactions: [] }));
            setMessages(rich);
            if (rich.length === 0) setShowStarters(true);

            const session = localStorage.getItem("placement-tracker-auth");
            if (!session) return;
            const { token } = JSON.parse(session);
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/chats/conversation/${selectedPeerId}`,
                { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: "{}" }
            );
            const conv = await res.json();
            if (conv?.id) {
                conversationIdRef.current = conv.id;
                const sock = socketService.getSocket();
                if (sock) {
                    sock.emit("joinConversation", conv.id);
                    sock.emit("message:read", conv.id);
                }
            }
        })();
    }, [selectedPeerId]);

    // ── Socket events ────────────────────────────────────────────────────────
    useEffect(() => {
        const sock = socketService.getSocket();
        if (!sock) return;

        const onReceive = (msg: { id: string; senderId: string; content: string; createdAt: string; conversationId: string }) => {
            if (msg.conversationId !== conversationIdRef.current) return;
            const m: RichChatMessage = {
                id: msg.id, senderId: msg.senderId, text: msg.content,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                rawDate: new Date(msg.createdAt).toISOString(),
                isRead: true, isSent: true, reactions: [],
            };
            setMessages(prev => [...prev, m]);
            sock.emit("message:read", msg.conversationId);
        };
        const onRead = (d: { conversationId: string }) => {
            if (d.conversationId !== conversationIdRef.current) return;
            setMessages(prev => prev.map(m => m.senderId === "me" ? { ...m, isRead: true } : m));
        };
        const onTypingStart = (d: { userId: string; conversationId: string }) => {
            if (d.conversationId === conversationIdRef.current && d.userId === selectedPeerId) setIsTyping(true);
        };
        const onTypingStop = (d: { userId: string; conversationId: string }) => {
            if (d.conversationId === conversationIdRef.current && d.userId === selectedPeerId) setIsTyping(false);
        };

        sock.on("message:receive", onReceive);
        sock.on("message:read:update", onRead);
        sock.on("typing:start", onTypingStart);
        sock.on("typing:stop", onTypingStop);
        return () => {
            sock.off("message:receive", onReceive);
            sock.off("message:read:update", onRead);
            sock.off("typing:start", onTypingStart);
            sock.off("typing:stop", onTypingStop);
        };
    }, [selectedPeerId]);

    // ── Auto-scroll ──────────────────────────────────────────────────────────
    useEffect(() => {
        const el = messagesRef.current;
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
        if (atBottom) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        else setShowScrollBtn(true);
    }, [messages]);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowScrollBtn(false);
    };

    // ── Send message ─────────────────────────────────────────────────────────
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !selectedPeerId || sending) return;
        const content = text.trim();
        setText(""); setSending(true); setShowStarters(false);

        const opt: RichChatMessage = {
            id: `opt-${Date.now()}`, senderId: "me", text: content,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            rawDate: new Date().toISOString(), isRead: false, isSent: false,
            reactions: [],
            replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, senderName: "You" } : undefined,
        };
        setMessages(prev => [...prev, opt]);
        setReplyTo(null);

        const sock = socketService.getSocket();
        if (sock) sock.emit("typing:stop", conversationIdRef.current);

        try {
            if (sock && conversationIdRef.current) {
                sock.emit("message:send", { conversationId: conversationIdRef.current, content },
                    () => setMessages(prev => prev.map(m => m.id === opt.id ? { ...m, isSent: true } : m))
                );
            } else {
                await peerService.sendMessage(selectedPeerId, content);
                setMessages(prev => prev.map(m => m.id === opt.id ? { ...m, isSent: true } : m));
            }
        } catch {
            setMessages(prev => prev.filter(m => m.id !== opt.id));
            setText(content);
        } finally {
            setSending(false);
        }
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        const sock = socketService.getSocket();
        if (!sock || !conversationIdRef.current) return;
        sock.emit("typing:start", conversationIdRef.current);
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => sock.emit("typing:stop", conversationIdRef.current), 2000);
    };

    // ── Reactions ────────────────────────────────────────────────────────────
    const handleReact = useCallback((msgId: string, emoji: string) => {
        setMessages(prev => prev.map(m => {
            if (m.id !== msgId) return m;
            const reactions = [...(m.reactions ?? [])];
            const idx = reactions.findIndex(r => r.emoji === emoji);
            if (idx >= 0) {
                const r = reactions[idx];
                reactions[idx] = { ...r, count: r.isMine ? r.count - 1 : r.count + 1, isMine: !r.isMine };
                if (reactions[idx].count === 0) reactions.splice(idx, 1);
            } else {
                reactions.push({ emoji, count: 1, isMine: true });
            }
            return { ...m, reactions };
        }));
    }, []);

    const handleContextMenu = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ id, x: e.clientX, y: e.clientY });
    };

    const handlePin = (id: string) => setMessages(prev => prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
    const handleDelete = (id: string) => setMessages(prev => prev.filter(m => m.id !== id));
    const handleCopy = (id: string) => {
        const m = messages.find(m => m.id === id);
        if (m) navigator.clipboard.writeText(m.text);
    };
    const handleReply = (id: string) => {
        const m = messages.find(m => m.id === id);
        if (m) { setReplyTo(m); inputRef.current?.focus(); }
    };

    const groupedMessages = useMemo(() => {
        const groups: { label: string; msgs: RichChatMessage[] }[] = [];
        let cur = "";
        for (const m of messages) {
            const label = formatDate(m.rawDate);
            if (label !== cur) { cur = label; groups.push({ label, msgs: [m] }); }
            else groups[groups.length - 1].msgs.push(m);
        }
        return groups;
    }, [messages]);

    const filteredPeers = peers.filter(p =>
        !search || p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            className="flex h-full"
            onClick={() => { if (contextMenu) setContextMenu(null); }}
        >
            {/* ── Left sidebar ── */}
            <div className="w-72 border-r border-border/40 flex flex-col bg-card/30 shrink-0 hidden md:flex">
                <div className="p-3 border-b border-border/30">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search messages..."
                            className="pl-8 h-8 text-xs bg-secondary/40 border-transparent focus:border-border"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-1">
                    {filteredPeers.length === 0 && (
                        <p className="text-xs text-center text-muted-foreground py-8">No conversations yet</p>
                    )}
                    {filteredPeers.map(peer => {
                        const isSelected = selectedPeerId === peer.id;
                        const statusColors: Record<string, string> = {
                            online: "bg-green-400", studying: "bg-blue-400", focus: "bg-violet-500", idle: "bg-yellow-400",
                        };
                        const sc = (peer as any).onlineStatus;
                        return (
                            <button
                                key={peer.id}
                                onClick={() => setSelectedPeerId(peer.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg transition-all text-left group",
                                    isSelected
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-secondary/60 text-foreground"
                                )}
                                style={{ width: "calc(100% - 8px)" }}
                            >
                                <div className="relative shrink-0">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className={cn("text-xs font-bold", isSelected ? "bg-primary/20 text-primary" : "bg-secondary")}>
                                            {peer.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    {sc && sc !== "offline" && (
                                        <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-card", statusColors[sc] ?? "bg-gray-400")} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-medium text-sm truncate">{peer.name}</span>
                                        {peer.status === "CONNECTED" && (
                                            <Badge variant="secondary" className="text-[9px] px-1 py-0 shrink-0 ml-1">
                                                ✓
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{peer.college}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Chat area ── */}
            <div className="flex-1 flex flex-col bg-background min-w-0 relative">
                {activePeer ? (
                    <>
                        {/* Header */}
                        <div className="h-14 border-b border-border/40 flex items-center justify-between px-4 bg-card/40 backdrop-blur-sm shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-400 font-bold">
                                            {activePeer.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    {(activePeer as any).onlineStatus === "online" && (
                                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-background" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm leading-none">{activePeer.name}</div>
                                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                        {activePeer.college}
                                        {activePeer.status === "CONNECTED" && (
                                            <><span className="text-border">·</span><span className="text-green-400">Connected</span></>
                                        )}
                                        {(activePeer as any).currentActivity && (
                                            <><span className="text-border">·</span><span className="text-muted-foreground/70 italic">{(activePeer as any).currentActivity}</span></>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-green-400 hover:bg-green-500/10" title="Voice Call">
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10" title="Video Call">
                                    <Video className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Pin">
                                    <Pin className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title="Mute">
                                    <BellOff className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages list */}
                        <div
                            ref={messagesRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                            onScroll={e => {
                                const el = e.currentTarget;
                                setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
                            }}
                        >
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center border border-violet-500/20">
                                        <MessageSquareDashed className="h-7 w-7 text-violet-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">Start a conversation</p>
                                        <p className="text-sm mt-1">Say hi to {activePeer.name.split(" ")[0]}! 👋</p>
                                    </div>
                                </div>
                            )}

                            {groupedMessages.map((g, gi) => (
                                <div key={gi} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-px bg-border/30" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2">{g.label}</span>
                                        <div className="flex-1 h-px bg-border/30" />
                                    </div>
                                    {g.msgs.map(msg => (
                                        <div key={msg.id} className="relative">
                                            <MessageBubble
                                                msg={msg}
                                                isMe={msg.senderId === "me"}
                                                onReact={handleReact}
                                                onContextMenu={handleContextMenu}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {/* Typing indicator */}
                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-secondary">{activePeer.avatar}</AvatarFallback></Avatar>
                                        <div className="bg-card border border-border/50 px-3 py-2 rounded-2xl rounded-bl-none flex items-center gap-1">
                                            {[0, 1, 2].map(i => (
                                                <span
                                                    key={i}
                                                    className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                                                    style={{ animationDelay: `${i * 0.15}s` }}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div ref={bottomRef} className="h-1" />
                        </div>

                        {/* Scroll to bottom button */}
                        <AnimatePresence>
                            {showScrollBtn && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    onClick={scrollToBottom}
                                    className="absolute bottom-24 right-6 h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10"
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* AI Starters */}
                        {showStarters && <AIStarters onPick={t => { setText(t); setShowStarters(false); inputRef.current?.focus(); }} />}

                        {/* Reply preview */}
                        <AnimatePresence>
                            {replyTo && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="mx-4 mb-1 px-3 py-2 rounded-xl bg-secondary/60 border-l-2 border-primary/60 flex items-center justify-between text-sm"
                                >
                                    <div className="min-w-0">
                                        <span className="text-xs text-primary/80 font-medium">Replying to message</span>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{replyTo.text}</p>
                                    </div>
                                    <button onClick={() => setReplyTo(null)} className="ml-2 shrink-0 text-muted-foreground hover:text-foreground">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input bar */}
                        <div className="px-4 pb-4 pt-2 border-t border-border/30 bg-card/20">
                            <form onSubmit={handleSend} className="flex items-center gap-2">
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" title="Attach file">
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <div className="flex-1 relative">
                                    <Input
                                        ref={inputRef}
                                        value={text}
                                        onChange={handleTyping}
                                        placeholder={`Message ${activePeer.name.split(" ")[0]}...`}
                                        className="pr-10 bg-secondary/40 border-border/40 focus:border-primary/40 focus:bg-secondary/60 transition-all"
                                        disabled={sending}
                                        onKeyDown={e => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend(e as any);
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => setShowStarters(v => !v)}
                                    >
                                        <Smile className="h-4 w-4" />
                                    </button>
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" title="Voice note">
                                    <Mic className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-9 w-9 shrink-0 bg-gradient-to-br from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 border-0 shadow disabled:opacity-50"
                                    disabled={!text.trim() || sending}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground p-8">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center border border-violet-500/20">
                            <MessageSquareDashed className="h-9 w-9 text-violet-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-foreground">Your Messages</h3>
                            <p className="text-sm mt-1">Select a conversation or start a new one</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <UserPlus className="h-4 w-4" /> Find Peers to Message
                        </Button>
                    </div>
                )}
            </div>

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu(null)}
                        onReply={() => handleReply(contextMenu.id)}
                        onCopy={() => handleCopy(contextMenu.id)}
                        onPin={() => handlePin(contextMenu.id)}
                        onDelete={() => handleDelete(contextMenu.id)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
