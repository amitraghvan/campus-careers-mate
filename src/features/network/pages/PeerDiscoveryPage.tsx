/**
 * PeerDiscoveryPage — AI-powered student networking hub.
 *
 * Sections:
 *   1. ⚡ Best Matches (AI) — ranked by compatibility %
 *   2. 🔥 Active Now — users currently online/studying
 *   3. 💪 Underrated Grinders — high consistency, low connections
 *   4. 🤝 Suggested Squads — AI-recommended study groups
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Zap, Flame, Brain, Users, Target,
    Sparkles, ChevronRight, RefreshCw, Wifi,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/clerk-react";
import { peerService } from "../services/peer.service";
import { AIPeerCard } from "../components/AIPeerCard";
import { Peer, Squad } from "../types/peer.types";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// ─── AI Enrichment ────────────────────────────────────────────────────────────

const ONLINE_STATUSES = ["online", "studying", "focus", "idle", "offline"] as const;
const ACTIVITIES = [
    "Solving DSA", "In focus mode", "Reviewing system design",
    "Practicing LeetCode", "Reading CLRS", "Debugging a project",
    "Studying ML", "Mock interview prep", "Writing resume",
];
const SKILL_POOL = [
    "DSA", "Web Dev", "ML/AI", "System Design", "React",
    "Python", "SQL", "Node.js", "Java", "Competitive Programming",
];

function enrichWithAI(peers: Peer[]): Peer[] {
    return peers.map((peer, i) => ({
        ...peer,
        matchScore: Math.floor(55 + Math.random() * 45),
        sharedGoals: ["SDE @ FAANG", "Crack DSA"].slice(0, Math.floor(Math.random() * 3)),
        skillOverlap: SKILL_POOL.slice(0, Math.floor(Math.random() * 4) + 1),
        consistencyScore: Math.floor(40 + Math.random() * 60),
        streak: Math.floor(Math.random() * 30),
        onlineStatus: ONLINE_STATUSES[i % ONLINE_STATUSES.length],
        currentActivity: Math.random() > 0.4 ? ACTIVITIES[i % ACTIVITIES.length] : undefined,
        connectionCount: Math.floor(Math.random() * 50),
        isAiMatch: i < 3,
        skills: peer.skills.length > 0 ? peer.skills : SKILL_POOL.slice(i % 6, (i % 6) + 3),
    }));
}

// ─── AI Squad suggestions (client-side for now) ───────────────────────────────

const AI_SQUADS: Squad[] = [
    {
        id: "s1", name: "DSA Crushers", members: 8,
        description: "Daily LeetCode + mock interview prep", topics: ["DSA", "CP", "FAANG"],
        matchScore: 91, avatars: ["AK", "SR", "PB"],
    },
    {
        id: "s2", name: "ML Explorers", members: 5,
        description: "Papers, projects, Kaggle competitions", topics: ["ML", "AI", "Python"],
        matchScore: 78, avatars: ["VN", "SK", "RT"],
    },
    {
        id: "s3", name: "Web3 Builders", members: 12,
        description: "Full-stack + system design deep dives", topics: ["Web Dev", "System Design"],
        matchScore: 65, avatars: ["AM", "JD", "KL"],
    },
];

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="p-5 rounded-xl border border-border/40 bg-card/40 space-y-4 animate-pulse">
            <div className="flex gap-3">
                <div className="h-12 w-12 rounded-full bg-secondary/60 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-secondary/60 rounded w-3/4" />
                    <div className="h-3 bg-secondary/40 rounded w-1/2" />
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary/40 shrink-0" />
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-secondary/40 rounded w-full" />
                <div className="h-3 bg-secondary/30 rounded w-5/6" />
            </div>
            <div className="flex gap-2">
                <div className="h-5 w-14 bg-secondary/40 rounded-full" />
                <div className="h-5 w-16 bg-secondary/40 rounded-full" />
            </div>
            <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 bg-secondary/40 rounded-lg" />
                <div className="h-8 flex-1 bg-secondary/60 rounded-lg" />
            </div>
        </div>
    );
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({
    icon: Icon, title, subtitle, count, accent, onRefresh,
}: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    count?: number;
    accent: string;
    onRefresh?: () => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", accent)}>
                    <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-base">{title}</h2>
                        {count !== undefined && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-5">
                                {count}
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
            </div>
            {onRefresh && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onRefresh}>
                    <RefreshCw className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
}

// ─── Squad Card ────────────────────────────────────────────────────────────────

function SquadCard({ squad }: { squad: Squad }) {
    const [joined, setJoined] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="p-4 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-md transition-all group"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{squad.name}</h3>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
                            {squad.matchScore}% match
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{squad.description}</p>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {squad.avatars.map(av => (
                                <div key={av} className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-primary">{av}</span>
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{squad.members} members</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-wrap gap-1 justify-end">
                        {squad.topics.slice(0, 2).map(t => (
                            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{t}</span>
                        ))}
                    </div>
                    <Button
                        size="sm"
                        className={cn(
                            "h-7 text-xs px-3 transition-all",
                            joined
                                ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30"
                                : "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 hover:from-violet-500 hover:to-blue-500"
                        )}
                        onClick={() => setJoined(true)}
                    >
                        {joined ? "✓ Joined" : "Join Squad"}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-16 flex flex-col items-center gap-4 text-center"
        >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center border border-violet-500/20">
                <Sparkles className="h-7 w-7 text-violet-400" />
            </div>
            <div>
                <h3 className="font-semibold mb-1">No exact matches for "{query}"</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                    AI is scanning similar profiles — try a different skill or reset filters to see all recommendations.
                </p>
            </div>
            <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
                <RefreshCw className="h-3.5 w-3.5" /> Show All Peers
            </Button>
        </motion.div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PeerDiscoveryPage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const firstName = user?.firstName || "there";

    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "sde" | "data" | "ml">("all");
    const [peers, setPeers] = useState<Peer[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Simulated AI greeting rotation
    const greetings = [
        `Welcome back, ${firstName} — AI found ${3 + Math.floor(Math.random() * 5)} high-value connections for you today`,
        `Hey ${firstName}! 3 peers match your DSA goals. Let's connect them!`,
        `${firstName}, your network score jumped 12% this week. Keep it up! 🚀`,
    ];
    const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const raw = await peerService.getPeers();
                setPeers(enrichWithAI(raw));
            } catch {
                // fallback: use demo data if backend is unavailable
                setPeers(enrichWithAI(DEMO_PEERS));
            } finally {
                setLoading(false);
            }
        })();
    }, [refreshKey]);

    const handleConnect = async (id: string, requestId?: string) => {
        const peer = peers.find(p => p.id === id);
        setPeers(curr => curr.map(p => p.id === id ? { ...p, status: "PENDING" } : p));
        try {
            if (peer?.status === "PENDING" && peer.requestId) {
                await peerService.acceptConnectionRequest(peer.requestId);
                setPeers(curr => curr.map(p => p.id === id ? { ...p, status: "CONNECTED" } : p));
            } else {
                await peerService.sendConnectionRequest(id);
            }
        } catch {
            setRefreshKey(k => k + 1);
        }
    };
    const handleChat = (id: string) => navigate("/network/chat", { state: { peerId: id } });

    // ── Sections ──────────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        return peers.filter(p => {
            const q = searchTerm.toLowerCase();
            const matchesSearch = !q ||
                p.name.toLowerCase().includes(q) ||
                p.college.toLowerCase().includes(q) ||
                p.skills.some(s => s.toLowerCase().includes(q)) ||
                p.targetRoles.some(r => r.toLowerCase().includes(q));
            const matchesFilter =
                activeFilter === "all" ||
                (activeFilter === "sde" && p.targetRoles.some(r => /sde|software/i.test(r))) ||
                (activeFilter === "data" && p.targetRoles.some(r => /data/i.test(r))) ||
                (activeFilter === "ml" && (p.skills.some(s => /ml|ai|machine/i.test(s)) || p.targetRoles.some(r => /ml|ai/i.test(r))));
            return matchesSearch && matchesFilter;
        });
    }, [peers, searchTerm, activeFilter]);

    const bestMatches = filtered
        .filter(p => p.status === "CONNECT")
        .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
        .slice(0, 6);

    const activeNow = filtered
        .filter(p => p.onlineStatus && p.onlineStatus !== "offline" && p.onlineStatus !== "idle")
        .slice(0, 3);

    const underrated = filtered
        .filter(p => (p.consistencyScore ?? 0) >= 70 && (p.connectionCount ?? 99) < 10)
        .slice(0, 3);

    const onlinePeerCount = peers.filter(p =>
        p.onlineStatus && p.onlineStatus !== "offline"
    ).length;

    return (
        <div className="space-y-10 pb-12">

            {/* ── AI Greeting Banner ────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 via-card to-blue-950/20 p-6"
            >
                {/* Decorative background */}
                <div className="absolute top-0 right-0 h-32 w-48 bg-gradient-to-bl from-violet-500/10 to-transparent blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-400">
                                <Sparkles className="h-3 w-3" /> AI Powered
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-green-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                {onlinePeerCount} peers online
                            </span>
                        </div>
                        <h1 className="text-xl font-semibold leading-snug mb-1">{greeting}</h1>
                        <p className="text-sm text-muted-foreground">
                            Your network grows as you study. Connect, collaborate, and level up together.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-1.5 border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/5"
                        onClick={() => setRefreshKey(k => k + 1)}
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> Refresh AI
                    </Button>
                </div>

                {/* Quick stats */}
                <div className="flex gap-4 mt-4 pt-4 border-t border-border/30 flex-wrap">
                    {[
                        { label: "Total Peers", value: peers.length, icon: Users },
                        { label: "AI Matches", value: bestMatches.length, icon: Zap },
                        { label: "Active Now", value: activeNow.length, icon: Wifi },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-semibold">{value}</span>
                            <span className="text-xs text-muted-foreground">{label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Search + Filter Bar ───────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, college, skill..."
                        className="pl-9 bg-card/50 border-border/50 focus:border-primary/40 focus:bg-card transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-0.5 w-full sm:w-auto">
                    {([
                        ["all", "All Peers"],
                        ["sde", "SDE"],
                        ["data", "Data Roles"],
                        ["ml", "ML / AI"],
                    ] as const).map(([value, label]) => (
                        <Button
                            key={value}
                            variant={activeFilter === value ? "default" : "outline"}
                            size="sm"
                            className={cn(
                                "h-8 text-xs shrink-0 transition-all",
                                activeFilter === value
                                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0 shadow"
                                    : "border-border/50 hover:border-primary/30"
                            )}
                            onClick={() => setActiveFilter(value)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* ── Loading Skeleton ──────────────────────────────────── */}
            {loading && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            <AnimatePresence>
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-12"
                    >
                        {/* ── ⚡ Best Matches ───────────────────────────────── */}
                        {bestMatches.length > 0 && (
                            <section className="space-y-5">
                                <SectionHeader
                                    icon={Zap}
                                    title="Best Matches"
                                    subtitle="AI ranked by compatibility, shared goals & skill overlap"
                                    count={bestMatches.length}
                                    accent="bg-violet-500/10 text-violet-400"
                                    onRefresh={() => setRefreshKey(k => k + 1)}
                                />
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {bestMatches.map((peer, i) => (
                                        <AIPeerCard
                                            key={peer.id}
                                            peer={peer}
                                            index={i}
                                            onConnect={handleConnect}
                                            onChat={handleChat}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── 🔥 Active Now ────────────────────────────────── */}
                        {activeNow.length > 0 && (
                            <section className="space-y-5">
                                <SectionHeader
                                    icon={Flame}
                                    title="Active Now"
                                    subtitle="Peers currently online, studying, or in focus mode"
                                    count={activeNow.length}
                                    accent="bg-orange-500/10 text-orange-400"
                                />
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {activeNow.map((peer, i) => (
                                        <AIPeerCard
                                            key={peer.id}
                                            peer={peer}
                                            index={i}
                                            onConnect={handleConnect}
                                            onChat={handleChat}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── 💪 Underrated Grinders ───────────────────────── */}
                        {underrated.length > 0 && (
                            <section className="space-y-5">
                                <SectionHeader
                                    icon={Brain}
                                    title="Underrated Grinders"
                                    subtitle="High consistency, few connections — hidden gems worth reaching out to"
                                    count={underrated.length}
                                    accent="bg-blue-500/10 text-blue-400"
                                />
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {underrated.map((peer, i) => (
                                        <AIPeerCard
                                            key={peer.id}
                                            peer={peer}
                                            index={i}
                                            onConnect={handleConnect}
                                            onChat={handleChat}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── 🤝 Suggested Squads ──────────────────────────── */}
                        <section className="space-y-5">
                            <SectionHeader
                                icon={Users}
                                title="Suggested Squads"
                                subtitle="AI-recommended study groups matching your goals"
                                accent="bg-green-500/10 text-green-400"
                            />
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {AI_SQUADS.map(squad => (
                                    <SquadCard key={squad.id} squad={squad} />
                                ))}
                            </div>
                        </section>

                        {/* ── Connected Peers ───────────────────────────────── */}
                        {filtered.filter(p => p.status === "CONNECTED").length > 0 && (
                            <section className="space-y-5">
                                <SectionHeader
                                    icon={Target}
                                    title="Your Network"
                                    subtitle="Peers you're already connected with"
                                    count={filtered.filter(p => p.status === "CONNECTED").length}
                                    accent="bg-primary/10 text-primary"
                                />
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filtered.filter(p => p.status === "CONNECTED").map((peer, i) => (
                                        <AIPeerCard
                                            key={peer.id}
                                            peer={peer}
                                            index={i}
                                            onConnect={handleConnect}
                                            onChat={handleChat}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── Pending Requests ──────────────────────────────── */}
                        {filtered.filter(p => p.status === "PENDING" && p.requestId).length > 0 && (
                            <section className="space-y-5">
                                <SectionHeader
                                    icon={Users}
                                    title="Incoming Requests"
                                    subtitle="Peers who want to connect with you"
                                    count={filtered.filter(p => p.status === "PENDING" && p.requestId).length}
                                    accent="bg-yellow-500/10 text-yellow-400"
                                />
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filtered.filter(p => p.status === "PENDING" && p.requestId).map((peer, i) => (
                                        <AIPeerCard
                                            key={peer.id}
                                            peer={peer}
                                            index={i}
                                            onConnect={handleConnect}
                                            onChat={handleChat}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── Empty state ───────────────────────────────────── */}
                        {filtered.length === 0 && searchTerm && (
                            <div className="grid">
                                <EmptyState query={searchTerm} onReset={() => setSearchTerm("")} />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Demo peers (fallback if backend isn't running) ──────────────────────────

const DEMO_PEERS: Peer[] = [
    {
        id: "d1", name: "Arjun Sharma", avatar: "AS", avatarUrl: "",
        degree: "B.Tech CSE", college: "IIT Bombay", batch: "2026",
        targetRoles: ["SDE @ FAANG", "Backend Engineer"],
        skills: ["DSA", "Java", "System Design", "Spring Boot"],
        bio: "Cracking FAANG in 2026. LeetCode streak: 45 days.",
        status: "CONNECT",
    },
    {
        id: "d2", name: "Priya Nair", avatar: "PN", avatarUrl: "",
        degree: "B.Tech IT", college: "NIT Trichy", batch: "2026",
        targetRoles: ["Data Scientist", "ML Engineer"],
        skills: ["Python", "ML/AI", "TensorFlow", "SQL"],
        bio: "Kaggle Competitions + Research. Building my first ML startup.",
        status: "CONNECT",
    },
    {
        id: "d3", name: "Rohan Verma", avatar: "RV", avatarUrl: "",
        degree: "B.Tech CSE", college: "BITS Pilani", batch: "2025",
        targetRoles: ["Full Stack Developer", "SWE"],
        skills: ["React", "Node.js", "Web Dev", "TypeScript"],
        bio: "Open source contributor. 3 projects shipped in 2025.",
        status: "CONNECT",
    },
    {
        id: "d4", name: "Sneha Patel", avatar: "SP", avatarUrl: "",
        degree: "MCA", college: "IIIT Hyderabad", batch: "2026",
        targetRoles: ["Software Engineer", "SDE"],
        skills: ["DSA", "Python", "Competitive Programming"],
        bio: "Codeforces Specialist. Solving 3 problems a day.",
        status: "CONNECT",
    },
    {
        id: "d5", name: "Karan Mehta", avatar: "KM", avatarUrl: "",
        degree: "B.Tech CSE", college: "DTU Delhi", batch: "2026",
        targetRoles: ["DevOps Engineer", "Cloud Engineer"],
        skills: ["AWS", "Docker", "Kubernetes", "System Design"],
        bio: "Cloud certified. Building scalable infra at scale.",
        status: "CONNECT",
    },
    {
        id: "d6", name: "Divya Krishnan", avatar: "DK", avatarUrl: "",
        degree: "B.Tech CSE", college: "VIT Vellore", batch: "2025",
        targetRoles: ["Product Manager", "SDE"],
        skills: ["SQL", "DSA", "Product Thinking", "Python"],
        bio: "PM + SDE hybrid. Shipped 2 college products with 500 users.",
        status: "CONNECT",
    },
];
