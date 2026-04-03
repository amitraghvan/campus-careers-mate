/**
 * VoiceRoomsPage — Discord-style persistent voice & video rooms.
 *
 * Features:
 *  - Browse open rooms by category
 *  - Create a room (public/private, topic, max size)
 *  - Join a room with "raise hand" queue
 *  - Speaker list with mute indicators
 *  - Listener count + spectate mode
 *  - Room spotlight (most popular)
 *  - AI-suggested rooms based on your goals
 *  - Room categories: Study, Discussion, Chill, Interview Practice
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic, MicOff, Headphones, Users, Plus, Search,
    Volume2, X, Lock, Globe, Star, Zap, Phone,
    PhoneOff, Video, VideoOff, Settings, Hand,
    Crown, Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomCategory = "Study" | "Discussion" | "Chill" | "Interview" | "Code";

interface VoiceRoom {
    id: string;
    title: string;
    category: RoomCategory;
    speakers: { name: string; avatar: string; isMuted: boolean; isSpeaking: boolean }[];
    listeners: number;
    maxSize: number;
    isPrivate: boolean;
    isLive: boolean;
    tags: string[];
    matchScore: number;
    description: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_ROOMS: VoiceRoom[] = [
    {
        id: "r1", title: "DSA Grind Room 🔥",
        category: "Study", isPrivate: false, isLive: true,
        speakers: [
            { name: "Arjun S.", avatar: "AS", isMuted: false, isSpeaking: true },
            { name: "Priya N.", avatar: "PN", isMuted: false, isSpeaking: false },
            { name: "Rohan V.", avatar: "RV", isMuted: true, isSpeaking: false },
        ],
        listeners: 8, maxSize: 20,
        tags: ["DSA", "LeetCode", "Graphs"],
        matchScore: 91,
        description: "Solving LeetCode Hard problems live. Screensharing + explanation. Jump in!",
    },
    {
        id: "r2", title: "System Design Q&A",
        category: "Discussion", isPrivate: false, isLive: true,
        speakers: [
            { name: "Karan M.", avatar: "KM", isMuted: false, isSpeaking: true },
            { name: "Sneha P.", avatar: "SP", isMuted: false, isSpeaking: false },
        ],
        listeners: 14, maxSize: 30,
        tags: ["System Design", "Mock", "FAANG"],
        matchScore: 78,
        description: "Open Q&A on system design patterns. Ask anything. Currently: Consistent Hashing.",
    },
    {
        id: "r3", title: "Chill Lo-fi Study 🎵",
        category: "Chill", isPrivate: false, isLive: true,
        speakers: [],
        listeners: 22, maxSize: 50,
        tags: ["Chill", "Focus", "Pomodoro"],
        matchScore: 52,
        description: "Silent room with lo-fi vibes. Just studying together, no talking. Pure focus mode.",
    },
    {
        id: "r4", title: "Mock Interviews — Java Backend",
        category: "Interview", isPrivate: false, isLive: true,
        speakers: [
            { name: "Rohan V.", avatar: "RV", isMuted: false, isSpeaking: true },
        ],
        listeners: 3, maxSize: 4,
        tags: ["Java", "Backend", "Mock", "1-on-1"],
        matchScore: 65,
        description: "1-on-1 mock interview. Currently: LLD for a Parking Lot system.",
    },
    {
        id: "r5", title: "ML Research Discussion",
        category: "Code", isPrivate: true, isLive: false,
        speakers: [],
        listeners: 0, maxSize: 8,
        tags: ["ML", "Research", "Invite Only"],
        matchScore: 73,
        description: "Private room for ML paper reading group. Invitation required.",
    },
];

const CATEGORY_COLORS: Record<RoomCategory, string> = {
    Study: "text-violet-400 bg-violet-400/10",
    Discussion: "text-blue-400 bg-blue-400/10",
    Chill: "text-green-400 bg-green-400/10",
    Interview: "text-orange-400 bg-orange-400/10",
    Code: "text-pink-400 bg-pink-400/10",
};

const CATEGORIES: RoomCategory[] = ["Study", "Discussion", "Chill", "Interview", "Code"];

// ─── Active Room Bar ──────────────────────────────────────────────────────────

function ActiveRoomBar({ room, onLeave }: { room: VoiceRoom; onLeave: () => void }) {
    const [muted, setMuted] = useState(false);
    const [deafened, setDeafened] = useState(false);
    const [videoOn, setVideoOn] = useState(false);

    return (
        <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-card/90 backdrop-blur-xl border-t border-border/50 shadow-2xl"
        >
            <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                    <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{room.title}</p>
                        <p className="text-xs text-muted-foreground">{room.speakers.length + room.listeners + 1} in room</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-10 w-10 rounded-full", muted ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-secondary hover:bg-secondary/80")}
                        onClick={() => setMuted(v => !v)}
                        title={muted ? "Unmute" : "Mute"}
                    >
                        {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-10 w-10 rounded-full", deafened ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-secondary hover:bg-secondary/80")}
                        onClick={() => setDeafened(v => !v)}
                        title={deafened ? "Undeafen" : "Deafen"}
                    >
                        {deafened ? <MicOff className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-10 w-10 rounded-full", videoOn ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-secondary hover:bg-secondary/80")}
                        onClick={() => setVideoOn(v => !v)}
                        title={videoOn ? "Camera Off" : "Camera On"}
                    >
                        {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80"
                        title="Raise Hand"
                    >
                        <Hand className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={onLeave}
                        className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white border-0 rounded-full gap-2"
                    >
                        <PhoneOff className="h-4 w-4" /> Leave
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Room Card ─────────────────────────────────────────────────────────────────

function RoomCard({ room, onJoin }: { room: VoiceRoom; onJoin: (r: VoiceRoom) => void }) {
    const catColor = CATEGORY_COLORS[room.category];
    const totalPeople = room.speakers.length + room.listeners;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className={cn(
                "p-5 rounded-2xl border transition-all space-y-4 cursor-pointer group",
                room.isLive ? "border-green-500/20 bg-green-500/5 hover:border-green-500/40" : "border-border/50 bg-card/70 hover:border-primary/30"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        {room.isLive && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                                <Volume2 className="h-2.5 w-2.5" /> LIVE
                            </span>
                        )}
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full", catColor)}>{room.category}</span>
                        {room.isPrivate && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug">{room.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{room.description}</p>
                </div>
                <span className={cn("text-[10px] px-2 py-1 rounded-full font-semibold shrink-0",
                    room.matchScore >= 80 ? "text-green-400 bg-green-400/10 border border-green-500/20" : "text-blue-400 bg-blue-400/10 border border-blue-500/20"
                )}>
                    {room.matchScore}%
                </span>
            </div>

            {/* Speakers */}
            {room.speakers.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mic className="h-3 w-3" />
                        <span>Speakers ({room.speakers.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {room.speakers.map(s => (
                            <div key={s.avatar} className="relative">
                                <Avatar className={cn("h-9 w-9 ring-2 transition-all", s.isSpeaking ? "ring-green-400/60 animate-pulse" : "ring-border/30")}>
                                    <AvatarFallback className="text-[10px] bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-400 font-bold">{s.avatar}</AvatarFallback>
                                </Avatar>
                                {s.isMuted && (
                                    <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500/20 border border-background flex items-center justify-center">
                                        <MicOff className="h-2 w-2 text-red-400" />
                                    </span>
                                )}
                                {s.isSpeaking && (
                                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400/20 flex items-center justify-center">
                                        <Circle className="h-2 w-2 text-green-400 fill-green-400 animate-ping" />
                                    </span>
                                )}
                                <p className="text-[8px] text-center text-muted-foreground mt-0.5 truncate w-9">{s.name.split(" ")[0]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags + stats */}
            <div className="flex flex-wrap gap-1.5">
                {room.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>)}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/20">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{totalPeople}/{room.maxSize}</span>
                    {room.listeners > 0 && <span className="flex items-center gap-1"><Headphones className="h-3 w-3" />{room.listeners} listening</span>}
                </div>
                <Button
                    size="sm"
                    className={cn(
                        "h-7 text-xs px-4",
                        room.isPrivate
                            ? "border-border/50 text-muted-foreground"
                            : "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 hover:from-violet-500 hover:to-blue-500"
                    )}
                    variant={room.isPrivate ? "outline" : "default"}
                    onClick={() => !room.isPrivate && onJoin(room)}
                    disabled={room.isPrivate || totalPeople >= room.maxSize}
                >
                    {room.isPrivate ? <><Lock className="h-3 w-3 mr-1" />Private</> : <><Phone className="h-3 w-3 mr-1" />Join</>}
                </Button>
            </div>
        </motion.div>
    );
}

// ─── Create Room Modal ─────────────────────────────────────────────────────────

function CreateRoomModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState({ title: "", category: "Study" as RoomCategory, maxSize: 20, isPrivate: false });
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9 }}
                className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">Create Voice Room</h2>
                    <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
                </div>
                <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Room Name</label>
                    <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. DSA Grind Room 🔥" className="bg-secondary/40" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Category</label>
                        <select
                            value={form.category}
                            onChange={e => setForm(f => ({ ...f, category: e.target.value as RoomCategory }))}
                            className="w-full h-9 rounded-lg border border-border/50 bg-secondary/40 text-sm px-3"
                        >
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Max Members</label>
                        <Input type="number" min={2} max={50} value={form.maxSize} onChange={e => setForm(f => ({ ...f, maxSize: Number(e.target.value) }))} className="bg-secondary/40" />
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
                    <div className="flex items-center gap-2">
                        {form.isPrivate ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Globe className="h-4 w-4 text-muted-foreground" />}
                        <p className="text-sm font-medium">{form.isPrivate ? "Private" : "Public"}</p>
                    </div>
                    <button
                        onClick={() => setForm(f => ({ ...f, isPrivate: !f.isPrivate }))}
                        className={cn("h-6 w-11 rounded-full transition-all", form.isPrivate ? "bg-violet-600" : "bg-secondary")}
                    >
                        <span className={cn("block h-5 w-5 rounded-full bg-white shadow transition-transform mx-0.5", form.isPrivate ? "translate-x-5" : "translate-x-0")} />
                    </button>
                </div>
                <Button
                    className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0"
                    disabled={!form.title.trim()}
                    onClick={onClose}
                >
                    <Mic className="h-4 w-4 mr-2" /> Start Room
                </Button>
            </motion.div>
        </motion.div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VoiceRoomsPage() {
    const [rooms, setRooms] = useState<VoiceRoom[]>(DEMO_ROOMS);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<RoomCategory | "All">("All");
    const [activeRoom, setActiveRoom] = useState<VoiceRoom | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const filtered = rooms.filter(r => {
        const q = search.toLowerCase();
        const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q));
        const matchesCat = category === "All" || r.category === category;
        return matchesSearch && matchesCat;
    });

    const liveRooms = rooms.filter(r => r.isLive);

    return (
        <div className={cn("flex-1 overflow-y-auto p-6 space-y-6", activeRoom && "pb-28")}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Volume2 className="h-5 w-5 text-violet-400" /> Voice Rooms</h1>
                    <p className="text-sm text-muted-foreground">{liveRooms.length} rooms live now · {liveRooms.reduce((s, r) => s + r.speakers.length + r.listeners, 0)} people active</p>
                </div>
                <Button
                    onClick={() => setShowCreate(true)}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0"
                >
                    <Plus className="h-4 w-4" /> Create Room
                </Button>
            </div>

            {/* AI Suggestion */}
            <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-950/20 flex items-start gap-3">
                <Zap className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                    <span className="text-violet-300 font-medium">AI Suggestion:</span> "DSA Grind Room" has 3 of your top matches live right now. Jump in and solve together! <span className="text-violet-400 cursor-pointer">Join now →</span>
                </p>
            </div>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rooms..." className="pl-8 h-8 text-xs bg-card/50" />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {(["All", ...CATEGORIES] as const).map(cat => (
                        <Button
                            key={cat}
                            size="sm"
                            variant={category === cat ? "default" : "outline"}
                            className={cn("h-7 text-xs shrink-0", category === cat && "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0")}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Room grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(room => (
                    <RoomCard key={room.id} room={room} onJoin={r => setActiveRoom(r)} />
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        <Volume2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>No rooms found. <button onClick={() => setShowCreate(true)} className="text-violet-400">Start one!</button></p>
                    </div>
                )}
            </div>

            {/* Active room bar */}
            <AnimatePresence>
                {activeRoom && <ActiveRoomBar room={activeRoom} onLeave={() => setActiveRoom(null)} />}
                {showCreate && <CreateRoomModal onClose={() => setShowCreate(false)} />}
            </AnimatePresence>
        </div>
    );
}
