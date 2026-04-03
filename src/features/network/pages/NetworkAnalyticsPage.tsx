/**
 * NetworkAnalyticsPage — Your personal network intelligence dashboard.
 *
 * Features:
 *  - Network Strength Score (composite)
 *  - Connection growth chart (bar visual)
 *  - Skill distribution across network (horizontal bars)
 *  - Active hours heatmap
 *  - Top peer contributors this week
 *  - Goal alignment map
 *  - Recommendations to grow strategically
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp, Users, Zap, Brain, Target, Clock,
    Star, ArrowUp, ArrowDown, Globe, Award, Flame,
    Activity, BarChart3, Network, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Mini Stats Card ──────────────────────────────────────────────────────────

function StatCard({ label, value, delta, icon: Icon, color, sub }: {
    label: string; value: string; delta?: number; icon: React.ElementType;
    color: string; sub?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl border border-border/50 bg-card/70 space-y-2"
        >
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", color)}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{value}</span>
                {delta !== undefined && (
                    <span className={cn("flex items-center gap-0.5 text-xs font-medium mb-0.5", delta >= 0 ? "text-green-400" : "text-red-400")}>
                        {delta >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {Math.abs(delta)}%
                    </span>
                )}
            </div>
            {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
        </motion.div>
    );
}

// ─── Bar Chart (pure CSS) ─────────────────────────────────────────────────────

const WEEKLY_GROWTH = [
    { week: "W1", connections: 2 },
    { week: "W2", connections: 5 },
    { week: "W3", connections: 3 },
    { week: "W4", connections: 8 },
    { week: "W5", connections: 6 },
    { week: "W6", connections: 12 },
    { week: "W7", connections: 9 },
    { week: "W8", connections: 15 },
];

function GrowthChart() {
    const max = Math.max(...WEEKLY_GROWTH.map(w => w.connections));
    return (
        <div className="p-5 rounded-2xl border border-border/50 bg-card/70 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-sm">Connection Growth</h3>
                    <p className="text-xs text-muted-foreground">New connections per week</p>
                </div>
                <Badge variant="secondary" className="text-xs">Last 8 weeks</Badge>
            </div>
            <div className="flex items-end gap-2 h-32">
                {WEEKLY_GROWTH.map((w, i) => (
                    <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(w.connections / max) * 100}%` }}
                            transition={{ duration: 0.6, delay: i * 0.07, ease: "easeOut" }}
                            className={cn(
                                "w-full rounded-t-lg min-h-[4px]",
                                i === WEEKLY_GROWTH.length - 1
                                    ? "bg-gradient-to-t from-violet-600 to-blue-500"
                                    : "bg-gradient-to-t from-violet-600/40 to-blue-500/40 hover:from-violet-600/70 hover:to-blue-500/70 transition-all"
                            )}
                        />
                        <span className="text-[9px] text-muted-foreground">{w.week}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+67% growth vs last month</span>
            </div>
        </div>
    );
}

// ─── Skill Distribution ───────────────────────────────────────────────────────

const SKILL_DIST = [
    { skill: "DSA / Algorithms", count: 31, color: "bg-violet-500" },
    { skill: "Web Development", count: 24, color: "bg-blue-500" },
    { skill: "Machine Learning", count: 18, color: "bg-green-500" },
    { skill: "System Design", count: 15, color: "bg-orange-500" },
    { skill: "Cloud / DevOps", count: 9, color: "bg-pink-500" },
    { skill: "Data Science", count: 7, color: "bg-yellow-500" },
];

function SkillDistribution() {
    const max = SKILL_DIST[0].count;
    return (
        <div className="p-5 rounded-2xl border border-border/50 bg-card/70 space-y-4">
            <div>
                <h3 className="font-semibold text-sm">Network Skills Map</h3>
                <p className="text-xs text-muted-foreground">Top skills across your network</p>
            </div>
            <div className="space-y-3">
                {SKILL_DIST.map(s => (
                    <div key={s.skill} className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>{s.skill}</span>
                            <span className="text-muted-foreground">{s.count} peers</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(s.count / max) * 100}%` }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className={cn("h-full rounded-full", s.color)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Activity Heatmap ─────────────────────────────────────────────────────────

const HOURS = ["12am", "4am", "8am", "12pm", "4pm", "8pm"];
const DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ActivityHeatmap() {
    const data = Array.from({ length: 7 * 6 }, () => Math.random());
    return (
        <div className="p-5 rounded-2xl border border-border/50 bg-card/70 space-y-4">
            <div>
                <h3 className="font-semibold text-sm">Peer Activity Heatmap</h3>
                <p className="text-xs text-muted-foreground">When your network is most active</p>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[360px]">
                    <div className="flex gap-1.5 mb-1 ml-8">
                        {HOURS.map(h => <span key={h} className="flex-1 text-[9px] text-muted-foreground">{h}</span>)}
                    </div>
                    {DAYS.map((day, di) => (
                        <div key={day} className="flex items-center gap-1.5 mb-1">
                            <span className="w-7 text-[9px] text-muted-foreground text-right">{day}</span>
                            {Array.from({ length: 6 }).map((_, hi) => {
                                const intensity = data[di * 6 + hi];
                                return (
                                    <motion.div
                                        key={hi}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: (di * 6 + hi) * 0.01 }}
                                        title={`${HOURS[hi]} ${day}: ${Math.round(intensity * 100)}% activity`}
                                        className={cn(
                                            "flex-1 h-6 rounded cursor-pointer transition-transform hover:scale-110",
                                            intensity > 0.75 ? "bg-violet-500"
                                                : intensity > 0.5 ? "bg-violet-500/60"
                                                    : intensity > 0.25 ? "bg-violet-500/30"
                                                        : "bg-secondary/60"
                                        )}
                                    />
                                );
                            })}
                        </div>
                    ))}
                    <div className="flex items-center gap-2 mt-2 ml-8">
                        <span className="text-[9px] text-muted-foreground">Less</span>
                        {["bg-secondary/60", "bg-violet-500/30", "bg-violet-500/60", "bg-violet-500"].map(c => (
                            <div key={c} className={cn("h-3 w-6 rounded", c)} />
                        ))}
                        <span className="text-[9px] text-muted-foreground">More</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Network Strength Score ───────────────────────────────────────────────────

const STRENGTH_DIMENSIONS = [
    { label: "Connection Diversity", score: 76, tip: "Connect with more Data Science peers" },
    { label: "Engagement Rate", score: 82, tip: "You comment and react regularly — great!" },
    { label: "Squad Involvement", score: 58, tip: "Join 1 more active squad to level up" },
    { label: "Content Contribution", score: 44, tip: "Share resources and posts more often" },
    { label: "Message Activity", score: 89, tip: "Excellent! Active messenger in your network" },
    { label: "Profile Completeness", score: 71, tip: "Add your GitHub and portfolio link" },
];

function NetworkStrengthScore() {
    const overall = Math.round(STRENGTH_DIMENSIONS.reduce((s, d) => s + d.score, 0) / STRENGTH_DIMENSIONS.length);
    const color = overall >= 75 ? "text-green-400" : overall >= 55 ? "text-yellow-400" : "text-red-400";
    return (
        <div className="p-5 rounded-2xl border border-border/50 bg-card/70 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Network className="h-4 w-4 text-violet-400" /> Network Strength
                    </h3>
                    <p className="text-xs text-muted-foreground">How influential you are in your network</p>
                </div>
                <div className={cn("text-3xl font-bold", color)}>{overall}</div>
            </div>
            <div className="space-y-3">
                {STRENGTH_DIMENSIONS.map(d => (
                    <div key={d.label} className="space-y-1 group">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">{d.label}</span>
                            <span className={cn("font-bold", d.score >= 75 ? "text-green-400" : d.score >= 55 ? "text-yellow-400" : "text-red-400")}>
                                {d.score}
                            </span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${d.score}%` }}
                                transition={{ duration: 0.7 }}
                                className={cn(
                                    "h-full rounded-full",
                                    d.score >= 75 ? "bg-green-500" : d.score >= 55 ? "bg-yellow-500" : "bg-red-500"
                                )}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground/70 italic hidden group-hover:block">{d.tip}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Top Contributors ─────────────────────────────────────────────────────────

const TOP_PEERS = [
    { name: "Arjun S.", avatar: "AS", activity: "12 posts, 48 reactions", badge: "🏆 Most Active" },
    { name: "Priya N.", avatar: "PN", activity: "8 posts, 23 comments", badge: "🔥 Top Contributor" },
    { name: "Rohan V.", avatar: "RV", activity: "5 squads joined, 15 sessions", badge: "🤝 Top Collaborator" },
];

// ─── AI Recommendations ───────────────────────────────────────────────────────

const AI_RECS = [
    { icon: "🎯", text: "Connect with 3 more System Design focused peers to strengthen your backend network", action: "Find them" },
    { icon: "📢", text: "Share a resource today — your network gets 2× more active after you post", action: "Post now" },
    { icon: "🏰", text: "Join 'System Design Ninjas' squad — 76% compatibility and 11 active members", action: "Join squad" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NetworkAnalyticsPage() {
    const [period, setPeriod] = useState<"week" | "month" | "all">("month");

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-violet-400" /> Network Analytics
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Your personal networking intelligence</p>
                </div>
                <div className="flex gap-1.5 p-1 bg-secondary rounded-xl">
                    {(["week", "month", "all"] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={cn(
                                "px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-all",
                                period === p ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {p === "all" ? "All time" : `This ${p}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Total Connections" value="34" delta={18} icon={Users} color="bg-violet-500/10 text-violet-400" sub="12 this month" />
                <StatCard label="Profile Views" value="127" delta={34} icon={Activity} color="bg-blue-500/10 text-blue-400" sub="By 89 unique peers" />
                <StatCard label="Squad Score" value="720" delta={12} icon={Award} color="bg-green-500/10 text-green-400" sub="Top 15% in network" />
                <StatCard label="AI Match Rate" value="91%" delta={5} icon={Zap} color="bg-orange-500/10 text-orange-400" sub="Your top match today" />
            </div>

            {/* Main charts row */}
            <div className="grid lg:grid-cols-2 gap-5">
                <GrowthChart />
                <SkillDistribution />
            </div>

            {/* Heatmap + Strength */}
            <div className="grid lg:grid-cols-2 gap-5">
                <ActivityHeatmap />
                <NetworkStrengthScore />
            </div>

            {/* Bottom row */}
            <div className="grid lg:grid-cols-2 gap-5">
                {/* Top contributors */}
                <div className="p-5 rounded-2xl border border-border/50 bg-card/70 space-y-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Star className="h-4 w-4 text-yellow-400" /> Top Peers This Week</h3>
                    <div className="space-y-3">
                        {TOP_PEERS.map((p, i) => (
                            <div key={p.name} className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-400 text-xs font-bold">{p.avatar}</AvatarFallback>
                                    </Avatar>
                                    <span className="absolute -top-1 -right-1 text-sm">{["🥇", "🥈", "🥉"][i]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{p.name}</p>
                                    <p className="text-xs text-muted-foreground">{p.activity}</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] shrink-0">{p.badge}</Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Recommendations */}
                <div className="p-5 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-blue-950/20 space-y-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-violet-400" /> AI Growth Recommendations</h3>
                    <div className="space-y-3">
                        {AI_RECS.map(r => (
                            <div key={r.text} className="flex gap-3 p-3 rounded-xl bg-card/40 border border-border/30">
                                <span className="text-xl shrink-0">{r.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">{r.text}</p>
                                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-violet-400 mt-1">
                                        {r.action} →
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
