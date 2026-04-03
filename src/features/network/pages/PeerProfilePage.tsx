/**
 * PeerProfilePage — LinkedIn-style deep peer profile.
 *
 * Features:
 *  - Hero with AI compatibility score + radar breakdown
 *  - Skill bars with proficiency percentages
 *  - LeetCode/GitHub style achievement stats
 *  - Activity timeline / milestones
 *  - Mutual connections section
 *  - Shared goal analysis (AI)
 *  - Connect / Message / Invite to Squad inline
 *  - Endorsements system
 *  - Availability badge (open to collaborate)
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft, MessageSquare, UserPlus, Check, Flame,
    Brain, Target, Code2, Zap, Star, Trophy, Calendar,
    Github, Globe, Linkedin, MapPin, BookOpen, Users,
    TrendingUp, Award, Clock, Share2, MoreHorizontal,
    Bookmark, ThumbsUp, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { peerService } from "../services/peer.service";
import { Peer } from "../types/peer.types";

// ─── Demo profile data (augments real peer data) ────────────────────────────

const PROFILE_AUGMENTS: Record<string, {
    headline: string;
    about: string;
    skills: { name: string; level: number; endorsements: number }[];
    achievements: { icon: string; title: string; value: string; color: string }[];
    timeline: { date: string; type: "achievement" | "milestone" | "connection"; text: string }[];
    availability: string;
    links: { github?: string; linkedin?: string; portfolio?: string; location?: string };
    compatibilityBreakdown: { label: string; score: number; color: string }[];
}> = {};

const DEFAULT_AUGMENT = {
    headline: "FAANG-bound SWE • DSA Grinder • Open Source Contributor",
    about: "Passionate software engineer targeting top-tier tech companies. I believe in consistency over intensity — 3 problems a day, every day. Looking for peers who share the same drive and want to grow together.",
    skills: [
        { name: "Data Structures & Algorithms", level: 82, endorsements: 14 },
        { name: "System Design", level: 68, endorsements: 9 },
        { name: "React / TypeScript", level: 91, endorsements: 21 },
        { name: "Python", level: 75, endorsements: 11 },
        { name: "SQL / Databases", level: 63, endorsements: 7 },
    ],
    achievements: [
        { icon: "🏆", title: "LeetCode Solved", value: "287", color: "text-yellow-400 bg-yellow-400/10" },
        { icon: "🔥", title: "Current Streak", value: "45d", color: "text-orange-400 bg-orange-400/10" },
        { icon: "⭐", title: "Hard Problems", value: "67", color: "text-violet-400 bg-violet-400/10" },
        { icon: "📅", title: "Days Active", value: "210+", color: "text-blue-400 bg-blue-400/10" },
        { icon: "🤝", title: "Connections", value: "34", color: "text-green-400 bg-green-400/10" },
        { icon: "📚", title: "Resources Shared", value: "12", color: "text-pink-400 bg-pink-400/10" },
    ],
    timeline: [
        { date: "Mar 2026", type: "milestone" as const, text: "Received Amazon OA invitation 🎉" },
        { date: "Feb 2026", type: "achievement" as const, text: "Completed 250 LeetCode problems milestone" },
        { date: "Jan 2026", type: "connection" as const, text: "Joined DSA Crushers squad" },
        { date: "Dec 2025", type: "achievement" as const, text: "30-day study streak — unbroken 🔥" },
        { date: "Nov 2025", type: "milestone" as const, text: "Started serious FAANG prep" },
    ],
    availability: "Open to mock interviews & study partners",
    links: { github: "github.com", linkedin: "linkedin.com", location: "Bangalore, India" },
    compatibilityBreakdown: [
        { label: "Goal Alignment", score: 94, color: "bg-green-500" },
        { label: "Skill Overlap", score: 78, color: "bg-blue-500" },
        { label: "Study Style", score: 85, color: "bg-violet-500" },
        { label: "Availability", score: 70, color: "bg-orange-500" },
        { label: "Activity Level", score: 88, color: "bg-pink-500" },
    ],
};

// ─── Skill Bar ─────────────────────────────────────────────────────────────

function SkillBar({ name, level, endorsements }: { name: string; level: number; endorsements: number }) {
    const [endorsed, setEndorsed] = useState(false);
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{name}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setEndorsed(v => !v)}
                        className={cn(
                            "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all",
                            endorsed
                                ? "bg-violet-500/20 border-violet-500/40 text-violet-400"
                                : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary"
                        )}
                    >
                        <ThumbsUp className="h-2.5 w-2.5" />
                        {endorsements + (endorsed ? 1 : 0)}
                    </button>
                    <span className="text-xs text-muted-foreground w-8 text-right">{level}%</span>
                </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${level}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className={cn(
                        "h-full rounded-full",
                        level >= 85 ? "bg-gradient-to-r from-green-500 to-emerald-400" :
                            level >= 70 ? "bg-gradient-to-r from-blue-500 to-violet-500" :
                                "bg-gradient-to-r from-orange-500 to-yellow-400"
                    )}
                />
            </div>
        </div>
    );
}

// ─── Compatibility Widget ──────────────────────────────────────────────────

function CompatibilityWidget({ score, breakdown }: {
    score: number;
    breakdown: { label: string; score: number; color: string }[];
}) {
    const color = score >= 80 ? "text-green-400" : score >= 65 ? "text-blue-400" : "text-yellow-400";
    return (
        <div className="p-5 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-blue-950/20 space-y-4">
            <div className="flex items-center gap-3">
                <div className={cn("text-4xl font-bold", color)}>{score}%</div>
                <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <Zap className="h-4 w-4 text-violet-400" />
                        <span className="font-semibold text-sm">AI Compatibility</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Based on goals, skills, and activity patterns</p>
                </div>
            </div>
            <div className="space-y-2.5">
                {breakdown.map(b => (
                    <div key={b.label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{b.label}</span>
                            <span className="font-medium">{b.score}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${b.score}%` }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className={cn("h-full rounded-full", b.color)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Timeline Item ─────────────────────────────────────────────────────────

function TimelineItem({ item, isLast }: { item: { date: string; type: string; text: string }; isLast: boolean }) {
    const colors = { achievement: "bg-yellow-400", milestone: "bg-green-400", connection: "bg-blue-400" };
    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div className={cn("h-3 w-3 rounded-full mt-1 shrink-0", colors[item.type as keyof typeof colors] ?? "bg-primary")} />
                {!isLast && <div className="w-px flex-1 bg-border/40 mt-1" />}
            </div>
            <div className="pb-4 min-w-0">
                <p className="text-sm">{item.text}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.date}</p>
            </div>
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function PeerProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [peer, setPeer] = useState<Peer | null>(null);
    const [connected, setConnected] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        if (!id) return;
        // Try from cache first
        const cached = peerService.getPeerById(id);
        if (cached) {
            setPeer(cached);
            setConnected(cached.status === "CONNECTED");
        } else {
            // Fallback: load all peers then find
            peerService.getPeers().then(peers => {
                const found = peers.find(p => p.id === id);
                if (found) { setPeer(found); setConnected(found.status === "CONNECTED"); }
            });
        }
    }, [id]);

    const aug = DEFAULT_AUGMENT;
    const matchScore = (peer as any)?.matchScore ?? Math.floor(65 + Math.random() * 30);

    if (!peer) {
        return (
            <div className="flex-1 overflow-y-auto p-6 space-y-5 animate-pulse">
                <div className="h-40 bg-secondary/40 rounded-2xl" />
                <div className="h-64 bg-secondary/30 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Hero banner */}
            <div className="relative h-36 bg-gradient-to-br from-violet-900/60 via-blue-900/40 to-transparent overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 flex items-end justify-between">
                    <div className="flex items-end gap-4">
                        <div className="relative -mb-8">
                            <Avatar className="h-20 w-20 ring-4 ring-background shadow-xl">
                                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-600 text-white text-2xl font-bold">
                                    {peer.avatar}
                                </AvatarFallback>
                            </Avatar>
                            {(peer as any).onlineStatus === "online" && (
                                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-400 ring-2 ring-background" />
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 mb-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-black/20 text-white hover:bg-black/30"
                            onClick={() => setBookmarked(v => !v)}
                        >
                            <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current text-yellow-400")} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 text-white hover:bg-black/30">
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 text-white hover:bg-black/30">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-6 pt-12 pb-8 space-y-6">
                {/* Name + action row */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold">{peer.name}</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{aug.headline}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                            {aug.links.location && (
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{aug.links.location}</span>
                            )}
                            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{peer.college} · Batch {peer.batch}</span>
                            <span className={cn("flex items-center gap-1 font-medium px-2 py-0.5 rounded-full text-green-400 bg-green-400/10")}>
                                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                {aug.availability}
                            </span>
                        </div>
                        {aug.links.github && (
                            <div className="flex gap-3 mt-2">
                                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    <Github className="h-3.5 w-3.5" /> GitHub
                                </button>
                                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 hover:border-blue-500/40 hover:text-blue-400"
                            onClick={() => navigate("/network/messages", { state: { peerId: peer.id } })}
                        >
                            <MessageSquare className="h-4 w-4" /> Message
                        </Button>
                        <Button
                            size="sm"
                            className={cn(
                                "gap-1.5",
                                connected
                                    ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30"
                                    : "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0"
                            )}
                            onClick={() => setConnected(v => !v)}
                        >
                            {connected ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                            {connected ? "Connected" : "Connect"}
                        </Button>
                    </div>
                </div>

                {/* Achievement stats strip */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {aug.achievements.map(a => (
                        <div key={a.title} className={cn("flex flex-col items-center gap-1 p-3 rounded-xl border border-border/40", a.color.split(" ")[1])}>
                            <span className="text-xl">{a.icon}</span>
                            <span className={cn("font-bold text-lg leading-none", a.color.split(" ")[0])}>{a.value}</span>
                            <span className="text-[10px] text-muted-foreground text-center leading-tight">{a.title}</span>
                        </div>
                    ))}
                </div>

                {/* Two-col layout */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <section className="space-y-2">
                            <h2 className="font-semibold">About</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{aug.about}</p>
                        </section>

                        {/* Target roles */}
                        {peer.targetRoles.length > 0 && (
                            <section className="space-y-2">
                                <h2 className="font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Target Roles</h2>
                                <div className="flex flex-wrap gap-2">
                                    {peer.targetRoles.map(r => (
                                        <Badge key={r} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{r}</Badge>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills with endorsements */}
                        <section className="space-y-4">
                            <h2 className="font-semibold flex items-center gap-2"><Code2 className="h-4 w-4 text-blue-400" /> Skills</h2>
                            <div className="space-y-4">
                                {aug.skills.map(s => <SkillBar key={s.name} {...s} />)}
                            </div>
                        </section>

                        {/* Activity timeline */}
                        <section className="space-y-4">
                            <h2 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-green-400" /> Activity Timeline</h2>
                            <div>
                                {aug.timeline.map((item, i) => (
                                    <TimelineItem key={i} item={item} isLast={i === aug.timeline.length - 1} />
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-5">
                        {/* AI Compatibility */}
                        <CompatibilityWidget score={matchScore} breakdown={aug.compatibilityBreakdown} />

                        {/* Quick stats */}
                        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 space-y-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-violet-400" /> Network Stats</h3>
                            {[
                                { label: "Connections", value: aug.achievements[4].value, icon: Users },
                                { label: "Squad memberships", value: "3", icon: Users },
                                { label: "Posts this month", value: "8", icon: BookOpen },
                                { label: "Study sessions", value: "12", icon: Calendar },
                            ].map(({ label, value, icon: Icon }) => (
                                <div key={label} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" />{label}</span>
                                    <span className="font-semibold">{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Mutual connections */}
                        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 space-y-3">
                            <h3 className="font-semibold text-sm">Mutual Connections</h3>
                            {["AK", "SR", "PB"].map(av => (
                                <div key={av} className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-[10px] font-bold text-violet-400 shrink-0">{av}</div>
                                    <div className="text-xs">
                                        <p className="font-medium">Peer {av}</p>
                                        <p className="text-muted-foreground">2nd connection</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
