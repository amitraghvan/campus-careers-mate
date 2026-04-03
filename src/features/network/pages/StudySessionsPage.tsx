/**
 * StudySessionsPage — Schedule & join live peer study sessions.
 *
 * Features:
 *  - Browse upcoming sessions (filterable by topic)
 *  - Join sessions with one click (+ member cap)
 *  - Create new session modal (topic, date, time, max members, description)
 *  - Live sessions (highlighted with pulse)
 *  - Your scheduled sessions tab
 *  - AI session recommendation
 *  - Session detail expand (agenda, participants, chat preview)
 *  - Recurring sessions support
 *  - Session types: Study, Mock Interview, Code Review, Discussion, Reading
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Clock, Users, Plus, Search, Video,
    Mic, BookOpen, Code2, MessageSquare, Zap,
    ChevronRight, X, Check, Flame, Star,
    Bell, MapPin, Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionType = "study" | "interview" | "code-review" | "discussion" | "reading";

interface Session {
    id: string;
    title: string;
    host: { name: string; avatar: string };
    type: SessionType;
    topic: string;
    date: string;
    time: string;
    duration: string;
    maxMembers: number;
    attendees: { name: string; avatar: string }[];
    isLive: boolean;
    isJoined: boolean;
    description: string;
    tags: string[];
    isRecurring: boolean;
    matchScore: number;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_SESSIONS: Session[] = [
    {
        id: "s1", title: "FAANG DSA Sprint — Graph Problems",
        host: { name: "Arjun Sharma", avatar: "AS" },
        type: "study", topic: "DSA",
        date: "Today", time: "8:00 PM", duration: "2h",
        maxMembers: 6, isLive: true, isJoined: false,
        attendees: [{ name: "Priya N.", avatar: "PN" }, { name: "Rohan V.", avatar: "RV" }, { name: "Sneha P.", avatar: "SP" }],
        description: "Solving 3 Hard graph problems together. BFS/DFS, Dijkstra, and Union-Find. Come prepared with LC premium.",
        tags: ["Graphs", "BFS", "DFS", "FAANG"],
        isRecurring: true, matchScore: 92,
    },
    {
        id: "s2", title: "Mock Interview Pair — System Design",
        host: { name: "Karan Mehta", avatar: "KM" },
        type: "interview", topic: "System Design",
        date: "Today", time: "9:30 PM", duration: "1h",
        maxMembers: 2, isLive: false, isJoined: false,
        attendees: [],
        description: "Design a rate limiter system. I'll be the interviewer, you'll be the candidate. Then we swap.",
        tags: ["Mock Interview", "System Design", "1-on-1"],
        isRecurring: false, matchScore: 85,
    },
    {
        id: "s3", title: "ML Paper Club — Attention Is All You Need",
        host: { name: "Priya Nair", avatar: "PN" },
        type: "reading", topic: "ML/AI",
        date: "Tomorrow", time: "7:00 PM", duration: "1.5h",
        maxMembers: 8, isLive: false, isJoined: true,
        attendees: [{ name: "Karan M.", avatar: "KM" }, { name: "Rohan V.", avatar: "RV" }],
        description: "Reading and discussing the Transformer paper. Bring your notes! We'll go section by section.",
        tags: ["ML", "Transformers", "Research"],
        isRecurring: true, matchScore: 74,
    },
    {
        id: "s4", title: "React Performance — Code Review Session",
        host: { name: "Rohan Verma", avatar: "RV" },
        type: "code-review", topic: "Web Dev",
        date: "Mar 25", time: "6:00 PM", duration: "1h",
        maxMembers: 4, isLive: false, isJoined: false,
        attendees: [{ name: "Sneha P.", avatar: "SP" }],
        description: "Reviewing each other's React components. Focus on memoization, lazy loading, and bundle size.",
        tags: ["React", "Performance", "Code Review"],
        isRecurring: false, matchScore: 67,
    },
    {
        id: "s5", title: "Placement Strategy Discussion",
        host: { name: "Sneha Patel", avatar: "SP" },
        type: "discussion", topic: "Career",
        date: "Mar 26", time: "8:00 PM", duration: "1h",
        maxMembers: 10, isLive: false, isJoined: false,
        attendees: [{ name: "Arjun S.", avatar: "AS" }, { name: "Priya N.", avatar: "PN" }, { name: "Karan M.", avatar: "KM" }],
        description: "Open discussion about placement season 2026. Resume reviews, offer negotiation, company rankings.",
        tags: ["Career", "Placement", "Resume"],
        isRecurring: false, matchScore: 88,
    },
];

const SESSION_TYPES: Record<SessionType, { icon: React.ElementType; label: string; color: string }> = {
    study: { icon: BookOpen, label: "Study", color: "text-violet-400 bg-violet-400/10" },
    interview: { icon: Mic, label: "Mock Interview", color: "text-orange-400 bg-orange-400/10" },
    "code-review": { icon: Code2, label: "Code Review", color: "text-blue-400 bg-blue-400/10" },
    discussion: { icon: MessageSquare, label: "Discussion", color: "text-green-400 bg-green-400/10" },
    reading: { icon: BookOpen, label: "Reading Club", color: "text-pink-400 bg-pink-400/10" },
};

const TOPIC_FILTERS = ["All", "DSA", "System Design", "ML/AI", "Web Dev", "Career"];

// ─── Create Session Modal ──────────────────────────────────────────────────────

function CreateSessionModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState({ title: "", topic: "DSA", type: "study" as SessionType, date: "", time: "", duration: "1h", max: 6, description: "", recurring: false });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9 }}
                className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg">Schedule a Session</h2>
                        <p className="text-sm text-muted-foreground">Invite peers to study together</p>
                    </div>
                    <button onClick={onClose}><X className="h-5 w-5 text-muted-foreground" /></button>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Session Title</label>
                        <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. FAANG DSA Sprint — Graphs" className="bg-secondary/40" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm(f => ({ ...f, type: e.target.value as SessionType }))}
                                className="w-full h-9 rounded-lg border border-border/50 bg-secondary/40 text-sm px-3"
                            >
                                {Object.entries(SESSION_TYPES).map(([k, v]) => (
                                    <option key={k} value={k}>{v.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Topic</label>
                            <select
                                value={form.topic}
                                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                                className="w-full h-9 rounded-lg border border-border/50 bg-secondary/40 text-sm px-3"
                            >
                                {TOPIC_FILTERS.filter(t => t !== "All").map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Date</label>
                            <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="bg-secondary/40" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Time</label>
                            <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="bg-secondary/40" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Max Members</label>
                            <Input type="number" min={2} max={20} value={form.max} onChange={e => setForm(f => ({ ...f, max: Number(e.target.value) }))} className="bg-secondary/40" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Description</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="What will you cover? Any prerequisites?"
                            className="w-full bg-secondary/40 rounded-lg border border-border/50 px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary/40 min-h-[72px]"
                        />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
                        <div className="flex items-center gap-2">
                            <Repeat className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Recurring Session</p>
                                <p className="text-xs text-muted-foreground">Repeat weekly at the same time</p>
                            </div>
                        </div>
                        <button onClick={() => setForm(f => ({ ...f, recurring: !f.recurring }))}
                            className={cn("h-6 w-11 rounded-full transition-all", form.recurring ? "bg-violet-600" : "bg-secondary")}>
                            <span className={cn("block h-5 w-5 rounded-full bg-white shadow transition-transform mx-0.5", form.recurring ? "translate-x-5" : "translate-x-0")} />
                        </button>
                    </div>
                    <Button
                        className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0"
                        disabled={!form.title.trim()}
                        onClick={onClose}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Schedule Session
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({ session, onJoin }: { session: Session; onJoin: (id: string) => void }) {
    const [expanded, setExpanded] = useState(false);
    const [joined, setJoined] = useState(session.isJoined);
    const typeInfo = SESSION_TYPES[session.type];
    const TypeIcon = typeInfo.icon;
    const spotsLeft = session.maxMembers - session.attendees.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "rounded-2xl border transition-all overflow-hidden",
                session.isLive ? "border-green-500/30 bg-green-500/5 shadow-md shadow-green-500/10" : "border-border/50 bg-card/70",
                "hover:border-primary/30"
            )}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", typeInfo.color.split(" ")[1])}>
                        <TypeIcon className={cn("h-5 w-5", typeInfo.color.split(" ")[0])} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-sm">{session.title}</h3>
                                    {session.isLive && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> LIVE
                                        </span>
                                    )}
                                    {session.isRecurring && (
                                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Repeat className="h-2.5 w-2.5" /> Weekly</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">hosted by {session.host.name}</p>
                            </div>
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0",
                                session.matchScore >= 80 ? "text-green-400 bg-green-400/10" : "text-blue-400 bg-blue-400/10"
                            )}>
                                {session.matchScore}% match
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{session.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time} · {session.duration}</span>
                            <span className={cn("flex items-center gap-1 font-medium", spotsLeft <= 1 ? "text-red-400" : "text-foreground")}>
                                <Users className="h-3 w-3" />
                                {session.attendees.length}/{session.maxMembers} · {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {session.tags.map(t => (
                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-3 mt-3 border-t border-border/30 space-y-3">
                                <p className="text-xs text-muted-foreground">{session.description}</p>
                                {session.attendees.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Attendees:</span>
                                        <div className="flex -space-x-2">
                                            {session.attendees.map(a => (
                                                <Avatar key={a.avatar} className="h-6 w-6 ring-2 ring-background">
                                                    <AvatarFallback className="text-[8px] bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-400 font-bold">{a.avatar}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{session.attendees.map(a => a.name).join(", ")}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                        {expanded ? "Less" : "More details"}
                        <ChevronRight className={cn("h-3 w-3 transition-transform", expanded && "rotate-90")} />
                    </button>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                            <Bell className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            size="sm"
                            className={cn(
                                "h-7 text-xs px-4",
                                joined
                                    ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                                    : session.isLive
                                        ? "bg-green-600 text-white hover:bg-green-700 border-0"
                                        : "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 hover:from-violet-500 hover:to-blue-500"
                            )}
                            onClick={() => { setJoined(v => !v); onJoin(session.id); }}
                            disabled={!joined && spotsLeft === 0}
                        >
                            {joined ? (
                                <><Check className="h-3 w-3 mr-1" /> Joined</>
                            ) : session.isLive ? (
                                <><Video className="h-3 w-3 mr-1" /> Join Live</>
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudySessionsPage() {
    const [sessions, setSessions] = useState<Session[]>(DEMO_SESSIONS);
    const [search, setSearch] = useState("");
    const [topicFilter, setTopicFilter] = useState("All");
    const [tab, setTab] = useState<"upcoming" | "mine">("upcoming");
    const [showCreate, setShowCreate] = useState(false);

    const handleJoin = (id: string) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, isJoined: !s.isJoined } : s));
    };

    const filtered = sessions.filter(s => {
        const q = search.toLowerCase();
        const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q));
        const matchesTopic = topicFilter === "All" || s.topic === topicFilter;
        const matchesTab = tab === "upcoming" || s.isJoined;
        return matchesSearch && matchesTopic && matchesTab;
    });

    const liveSessions = sessions.filter(s => s.isLive);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2"><Calendar className="h-5 w-5 text-violet-400" /> Study Sessions</h1>
                    <p className="text-sm text-muted-foreground">Schedule, join, and lead collaborative study sessions</p>
                </div>
                <Button
                    onClick={() => setShowCreate(true)}
                    className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0"
                >
                    <Plus className="h-4 w-4" /> Host Session
                </Button>
            </div>

            {/* Live banner */}
            {liveSessions.length > 0 && (
                <div className="p-4 rounded-2xl border border-green-500/30 bg-green-500/5 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse shrink-0" />
                        <div>
                            <p className="font-semibold text-sm">{liveSessions[0].title}</p>
                            <p className="text-xs text-muted-foreground">Live now · {liveSessions[0].attendees.length} attending</p>
                        </div>
                    </div>
                    <Button size="sm" className="bg-green-600 text-white hover:bg-green-700 border-0 gap-1.5">
                        <Video className="h-3.5 w-3.5" /> Join Live Session
                    </Button>
                </div>
            )}

            {/* AI recommendation */}
            <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-950/20 flex items-start gap-3">
                <Zap className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-violet-300">AI Recommendation</p>
                    <p className="text-xs text-muted-foreground">"FAANG DSA Sprint" is live right now with 3 of your top matches. Your skill overlap is 92%. <span className="text-violet-400 cursor-pointer">Join now →</span></p>
                </div>
            </div>

            {/* Tabs + filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex gap-1 p-1 bg-secondary rounded-xl">
                    {(["upcoming", "mine"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={cn(
                                "px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-all",
                                tab === t ? "bg-background shadow text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {t === "mine" ? "My Sessions" : "All Sessions"}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sessions..." className="pl-8 h-8 text-xs bg-card/50" />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {TOPIC_FILTERS.map(t => (
                        <Button
                            key={t}
                            size="sm"
                            variant={topicFilter === t ? "default" : "outline"}
                            className={cn("h-7 text-xs shrink-0", topicFilter === t && "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0")}
                            onClick={() => setTopicFilter(t)}
                        >
                            {t}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Session grid */}
            <div className="grid lg:grid-cols-2 gap-4">
                {filtered.map(session => (
                    <SessionCard key={session.id} session={session} onJoin={handleJoin} />
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-2 py-12 text-center text-muted-foreground">
                        <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>No sessions found. <button onClick={() => setShowCreate(true)} className="text-violet-400 hover:text-violet-300">Host one?</button></p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showCreate && <CreateSessionModal onClose={() => setShowCreate(false)} />}
            </AnimatePresence>
        </div>
    );
}
