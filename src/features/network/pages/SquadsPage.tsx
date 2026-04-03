/**
 * SquadsPage — Discord-style group study rooms.
 *
 * Features:
 *  - Browse & join AI-matched squads
 *  - Create a new squad
 *  - Group chat per squad (UI pattern)
 *  - Member lists with online status
 *  - Squad categories (DSA / ML / Web / System Design)
 *  - AI match score per squad
 *  - Spotlight: Most Active Squads
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Plus, Search, Zap, Hash, Lock, Globe,
    Flame, Brain, Code2, Layers, Star, ChevronRight,
    MessageSquare, Settings, Crown, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Squad {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    memberCount: number;
    onlineCount: number;
    topics: string[];
    matchScore: number;
    isPrivate: boolean;
    isJoined: boolean;
    isHot: boolean;
    createdBy: string;
    avatars: string[];
    lastActivity: string;
    channels: { id: string; name: string; type: "text" | "voice" }[];
}

interface SquadMessage { id: string; sender: string; avatar: string; text: string; time: string; }

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_SQUADS: Squad[] = [
    {
        id: "q1", name: "DSA Crushers", description: "Daily 3 LeetCode problems + weekly mock interviews. FAANG or bust!",
        category: "DSA", icon: "⚡", memberCount: 28, onlineCount: 7, isPrivate: false, isJoined: false, isHot: true,
        topics: ["LeetCode", "FAANG Prep", "Algorithms", "Data Structures"],
        matchScore: 93, createdBy: "Arjun S.", avatars: ["AS", "RV", "PB", "SK"],
        lastActivity: "2 min ago",
        channels: [
            { id: "c1", name: "general", type: "text" },
            { id: "c2", name: "daily-problem", type: "text" },
            { id: "c3", name: "mock-interviews", type: "voice" },
            { id: "c4", name: "resources", type: "text" },
        ],
    },
    {
        id: "q2", name: "ML Explorers", description: "ML papers, Kaggle competitions, and research discussions. No fluff.",
        category: "ML/AI", icon: "🧠", memberCount: 15, onlineCount: 4, isPrivate: false, isJoined: true, isHot: false,
        topics: ["Machine Learning", "Deep Learning", "Python", "Kaggle"],
        matchScore: 81, createdBy: "Priya N.", avatars: ["PN", "VK", "DM"],
        lastActivity: "15 min ago",
        channels: [
            { id: "c5", name: "general", type: "text" },
            { id: "c6", name: "paper-discussions", type: "text" },
            { id: "c7", name: "project-collab", type: "voice" },
        ],
    },
    {
        id: "q3", name: "System Design Ninjas", description: "High-level system design, scalability interviews, architecture.",
        category: "System Design", icon: "🏗️", memberCount: 42, onlineCount: 11, isPrivate: false, isJoined: false, isHot: true,
        topics: ["System Design", "Databases", "Scalability", "FAANG"],
        matchScore: 76, createdBy: "Karan M.", avatars: ["KM", "SR", "AT", "LN"],
        lastActivity: "Just now",
        channels: [
            { id: "c8", name: "design-discussions", type: "text" },
            { id: "c9", name: "case-studies", type: "text" },
            { id: "c10", name: "reviews", type: "voice" },
        ],
    },
    {
        id: "q4", name: "Full Stack Builders", description: "React, Node.js, APIs, open source. Ship real projects together.",
        category: "Web Dev", icon: "🔨", memberCount: 19, onlineCount: 5, isPrivate: false, isJoined: false, isHot: false,
        topics: ["React", "Node.js", "TypeScript", "Open Source"],
        matchScore: 68, createdBy: "Rohan V.", avatars: ["RV", "AK", "JD"],
        lastActivity: "1 hr ago",
        channels: [
            { id: "c11", name: "projects", type: "text" },
            { id: "c12", name: "code-reviews", type: "text" },
            { id: "c13", name: "collab-space", type: "voice" },
        ],
    },
    {
        id: "q5", name: "CP Warriors", description: "Codeforces + AtCoder grind. Rated 1600+ only. Serious competitive programming.",
        category: "Competitive", icon: "🏆", memberCount: 11, onlineCount: 3, isPrivate: true, isJoined: false, isHot: false,
        topics: ["Codeforces", "AtCoder", "Algorithms", "Math"],
        matchScore: 55, createdBy: "Sneha P.", avatars: ["SP", "AK"],
        lastActivity: "3 hr ago",
        channels: [
            { id: "c14", name: "problems", type: "text" },
            { id: "c15", name: "contest-discussion", type: "text" },
        ],
    },
];

const DEMO_SQUAD_MESSAGES: SquadMessage[] = [
    { id: "m1", sender: "Arjun S.", avatar: "AS", text: "Just solved #42 Trapping Rain Water! Anyone want to discuss the O(n) approach?", time: "2:14 PM" },
    { id: "m2", sender: "Rohan V.", avatar: "RV", text: "Already there! The two-pointer trick is 🔥 Let me share my solution", time: "2:16 PM" },
    { id: "m3", sender: "Priya N.", avatar: "PN", text: "Great problem! This comes up a lot in FAANG interviews. Stack approach is also valid.", time: "2:18 PM" },
    { id: "m4", sender: "You", avatar: "ME", text: "Thanks everyone! Testing the DP approach now. Meeting at 8 PM for mock interview?", time: "2:21 PM" },
];

const CATEGORIES = ["All", "DSA", "ML/AI", "System Design", "Web Dev", "Competitive"];
const CAT_ICONS: Record<string, React.ElementType> = {
    DSA: Zap, "ML/AI": Brain, "System Design": Layers, "Web Dev": Code2, Competitive: Flame,
};

// ─── Squad Card ───────────────────────────────────────────────────────────────

function SquadCard({ squad, onSelect, onJoin }: {
    squad: Squad;
    onSelect: (s: Squad) => void;
    onJoin: (id: string) => void;
}) {
    const [joined, setJoined] = useState(squad.isJoined);
    const matchColor = squad.matchScore >= 80 ? "text-green-400 bg-green-500/10" : squad.matchScore >= 65 ? "text-blue-400 bg-blue-500/10" : "text-muted-foreground bg-secondary";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className={cn(
                "group relative flex flex-col gap-3 p-5 rounded-xl border transition-all cursor-pointer",
                "hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
                joined ? "border-green-500/20 bg-green-500/5" : "border-border/50 bg-card/60"
            )}
            onClick={() => onSelect(squad)}
        >
            {squad.isHot && (
                <span className="absolute -top-2.5 left-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    <Flame className="h-2.5 w-2.5" /> HOT
                </span>
            )}

            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-xl border border-violet-500/20">
                        {squad.icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{squad.name}</h3>
                            {squad.isPrivate ? <Lock className="h-3 w-3 text-muted-foreground" /> : <Globe className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" /> {squad.memberCount}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-green-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> {squad.onlineCount} online
                            </span>
                        </div>
                    </div>
                </div>
                <span className={cn("shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold", matchColor)}>
                    {squad.matchScore}% match
                </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">{squad.description}</p>

            <div className="flex flex-wrap gap-1.5">
                {squad.topics.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/30">
                <div className="flex -space-x-2">
                    {squad.avatars.slice(0, 4).map(av => (
                        <div key={av} className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border-2 border-background flex items-center justify-center">
                            <span className="text-[8px] font-bold text-violet-400">{av}</span>
                        </div>
                    ))}
                    {squad.memberCount > 4 && (
                        <div className="h-6 w-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center">
                            <span className="text-[8px] text-muted-foreground">+{squad.memberCount - 4}</span>
                        </div>
                    )}
                </div>
                <Button
                    size="sm"
                    className={cn(
                        "h-7 text-xs px-3",
                        joined
                            ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30"
                            : "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 hover:from-violet-500 hover:to-blue-500"
                    )}
                    onClick={e => {
                        e.stopPropagation();
                        setJoined(v => !v);
                        onJoin(squad.id);
                    }}
                >
                    {joined ? "✓ Joined" : squad.isPrivate ? "Request" : "Join"}
                </Button>
            </div>
        </motion.div>
    );
}

// ─── Squad Detail Panel ────────────────────────────────────────────────────────

function SquadPanel({ squad, onClose }: { squad: Squad; onClose: () => void }) {
    const [msg, setMsg] = useState("");
    const [msgs, setMsgs] = useState<SquadMessage[]>(DEMO_SQUAD_MESSAGES);
    const [activeChannel, setActiveChannel] = useState(squad.channels[0]);

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg.trim()) return;
        setMsgs(prev => [...prev, {
            id: `m${Date.now()}`, sender: "You", avatar: "ME",
            text: msg.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
        setMsg("");
    };

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl z-40 flex shadow-2xl"
        >
            {/* Channel sidebar */}
            <div className="w-48 bg-card border-l border-r border-border/40 flex flex-col shrink-0">
                <div className="p-3 border-b border-border/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm truncate">{squad.name}</h3>
                            <p className="text-[10px] text-green-400 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> {squad.onlineCount} online
                            </p>
                        </div>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-2">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 py-2 overflow-y-auto">
                    <div className="px-3 mb-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Channels</span>
                    </div>
                    {squad.channels.map(ch => (
                        <button
                            key={ch.id}
                            onClick={() => setActiveChannel(ch)}
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md mx-1 transition-colors",
                                "  w-[calc(100%-8px)]",
                                activeChannel.id === ch.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                            )}
                        >
                            {ch.type === "voice" ? <span className="text-base">🔊</span> : <Hash className="h-3 w-3" />}
                            {ch.name}
                        </button>
                    ))}
                    <div className="px-3 mt-3 mb-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Members ({squad.memberCount})</span>
                    </div>
                    {squad.avatars.map(av => (
                        <div key={av} className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-[8px] font-bold text-violet-400">{av}</div>
                            {av}
                        </div>
                    ))}
                </div>
                <div className="p-2 border-t border-border/30">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground w-full px-2 py-1.5 rounded-md hover:bg-secondary/60 transition-colors">
                        <Settings className="h-3 w-3" /> Squad Settings
                    </button>
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col bg-background border-l border-border/40">
                <div className="h-12 border-b border-border/30 flex items-center gap-2 px-4 shrink-0">
                    {activeChannel.type === "voice" ? <span>🔊</span> : <Hash className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-semibold text-sm">{activeChannel.name}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {msgs.map(m => (
                        <div key={m.id} className={cn("flex gap-2.5", m.sender === "You" ? "flex-row-reverse" : "flex-row")}>
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400 shrink-0">
                                {m.avatar}
                            </div>
                            <div className={cn("max-w-[75%]", m.sender === "You" ? "items-end" : "items-start", "flex flex-col gap-0.5")}>
                                <span className="text-[10px] text-muted-foreground">{m.sender === "You" ? "" : m.sender} · {m.time}</span>
                                <div className={cn(
                                    "px-3 py-2 rounded-xl text-sm",
                                    m.sender === "You"
                                        ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-br-none"
                                        : "bg-card border border-border/50 rounded-bl-none"
                                )}>
                                    {m.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 border-t border-border/30">
                    <form onSubmit={send} className="flex gap-2">
                        <Input
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                            placeholder={`Message #${activeChannel.name}`}
                            className="flex-1 h-9 text-sm bg-secondary/40 border-border/40"
                        />
                        <Button type="submit" size="icon" className="h-9 w-9 bg-gradient-to-br from-violet-600 to-blue-600 border-0">
                            <MessageSquare className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Create Squad Modal ────────────────────────────────────────────────────────

function CreateSquadModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

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
                exit={{ scale: 0.9, y: 20 }}
                className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-bold text-lg">Create a Squad</h2>
                        <p className="text-sm text-muted-foreground">Start a study group and invite peers</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Squad Name</label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. FAANG Prep 2026" className="bg-secondary/40 border-border/50" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Description</label>
                        <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's the squad about?" className="bg-secondary/40 border-border/50" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/40">
                        <div className="flex items-center gap-2">
                            {isPrivate ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Globe className="h-4 w-4 text-muted-foreground" />}
                            <div>
                                <p className="text-sm font-medium">{isPrivate ? "Private" : "Public"} Squad</p>
                                <p className="text-xs text-muted-foreground">{isPrivate ? "Invite only" : "Anyone can join"}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsPrivate(v => !v)}
                            className={cn("h-6 w-11 rounded-full transition-all", isPrivate ? "bg-violet-600" : "bg-secondary")}
                        >
                            <span className={cn("block h-5 w-5 rounded-full bg-white shadow transition-transform mx-0.5", isPrivate ? "translate-x-5" : "translate-x-0")} />
                        </button>
                    </div>
                    <Button
                        className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 mt-2"
                        disabled={!name.trim()}
                        onClick={onClose}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Create Squad
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SquadsPage() {
    const [squads, setSquads] = useState<Squad[]>(DEMO_SQUADS);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const handleJoin = (id: string) => {
        setSquads(prev => prev.map(s => s.id === id ? { ...s, isJoined: !s.isJoined } : s));
    };

    const filtered = squads.filter(s => {
        const q = search.toLowerCase();
        const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.topics.some(t => t.toLowerCase().includes(q));
        const matchesCat = category === "All" || s.category === category;
        return matchesSearch && matchesCat;
    });

    const joinedSquads = squads.filter(s => s.isJoined);

    return (
        <div className="flex h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Study Squads</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">AI-matched group study rooms. Find your tribe.</p>
                    </div>
                    <Button
                        onClick={() => setShowCreate(true)}
                        className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 hover:from-violet-500 hover:to-blue-500"
                    >
                        <Plus className="h-4 w-4" /> Create Squad
                    </Button>
                </div>

                {/* Your Squads */}
                {joinedSquads.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" /> Your Squads
                        </h2>
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {joinedSquads.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedSquad(s)}
                                    className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all text-sm font-medium"
                                >
                                    <span>{s.icon}</span>
                                    {s.name}
                                    <span className="text-[10px] text-green-400">{s.onlineCount} online</span>
                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search + Category filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search squads..."
                            className="pl-9 bg-card/50 border-border/50"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-0.5">
                        {CATEGORIES.map(cat => {
                            const Icon = CAT_ICONS[cat];
                            return (
                                <Button
                                    key={cat}
                                    size="sm"
                                    variant={category === cat ? "default" : "outline"}
                                    className={cn("h-8 text-xs shrink-0 gap-1.5", category === cat && "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0")}
                                    onClick={() => setCategory(cat)}
                                >
                                    {Icon && <Icon className="h-3 w-3" />}
                                    {cat}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Squad grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((squad, i) => (
                        <SquadCard
                            key={squad.id}
                            squad={squad}
                            onSelect={setSelectedSquad}
                            onJoin={handleJoin}
                        />
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            <p>No squads match your search.</p>
                            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setSearch(""); setCategory("All"); }}>
                                Reset filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Squad detail panel */}
            <AnimatePresence>
                {selectedSquad && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-30"
                            onClick={() => setSelectedSquad(null)}
                        />
                        <SquadPanel squad={selectedSquad} onClose={() => setSelectedSquad(null)} />
                    </>
                )}
                {showCreate && <CreateSquadModal onClose={() => setShowCreate(false)} />}
            </AnimatePresence>
        </div>
    );
}
