/**
 * Profile Page — user profile, stats, and data management.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User, Mail, GraduationCap, Calendar, Award, Target,
    TrendingUp, Download, RotateCcw, CheckCircle2, BarChart3,
    Shield, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks";
import { opportunityService } from "@/services";
import { formatDate } from "@/utils/date";

export default function ProfilePage() {
    const { user } = useAuth();
    const opportunities = opportunityService.getAll();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [college, setCollege] = useState(user?.college || "");

    // Calculate stats
    const totalApps = opportunities.length;
    const selected = opportunities.filter((o) => o.status === "selected").length;
    const rejected = opportunities.filter((o) => o.status === "rejected").length;
    const inProgress = opportunities.filter((o) => ["applied", "interview"].includes(o.status)).length;
    const wishlist = opportunities.filter((o) => o.status === "wishlist").length;
    const successRate = totalApps > 0 ? Math.round((selected / totalApps) * 100) : 0;

    // Unique companies
    const companies = new Set(opportunities.map((o) => o.company)).size;

    // Checklist progress
    const totalChecklist = opportunities.reduce((sum, o) => sum + o.checklist.length, 0);
    const completedChecklist = opportunities.reduce((sum, o) => sum + o.checklist.filter((c) => c.done).length, 0);

    const handleExport = () => {
        const data = {
            user: { name: user?.name, email: user?.email, college: user?.college },
            opportunities,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `placetrack-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        if (window.confirm("Are you sure? This will delete ALL your opportunity data. This cannot be undone.")) {
            opportunityService.reset();
            window.location.reload();
        }
    };

    const statCards = [
        { label: "Total Applied", value: totalApps, icon: Briefcase, color: "text-primary", bg: "from-primary/20 to-info/10" },
        { label: "Offers", value: selected, icon: Award, color: "text-success", bg: "from-success/20 to-primary/10" },
        { label: "In Progress", value: inProgress, icon: TrendingUp, color: "text-warning", bg: "from-warning/20 to-destructive/10" },
        { label: "Success Rate", value: `${successRate}%`, icon: Target, color: "text-info", bg: "from-info/20 to-accent/10" },
        { label: "Companies", value: companies, icon: BarChart3, color: "text-accent", bg: "from-accent/20 to-primary/10" },
        { label: "Wishlist", value: wishlist, icon: CheckCircle2, color: "text-muted-foreground", bg: "from-secondary/40 to-secondary/20" },
    ];

    return (
        <div className="space-y-6 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-display font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your account and view stats</p>
            </motion.div>

            {/* User card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-6"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary shrink-0">
                        <User className="h-9 w-9 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="space-y-3">
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="bg-secondary/50 border-border/30" />
                                <Input value={college} onChange={(e) => setCollege(e.target.value)} placeholder="College" className="bg-secondary/50 border-border/30" />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => setIsEditing(false)} className="bg-gradient-to-r from-primary to-info text-primary-foreground border-0">
                                        Save
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-display font-bold">{user?.name || "User"}</h2>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{user?.email}</span>
                                    {user?.college && <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" />{user.college}</span>}
                                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Joined {user?.createdAt ? formatDate(user.createdAt) : "N/A"}</span>
                                </div>
                            </>
                        )}
                    </div>
                    {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="shrink-0">
                            Edit Profile
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                        className="glass-card rounded-xl p-4 relative overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-30`} />
                        <div className="relative">
                            <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Checklist progress */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-xl p-5"
            >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Preparation Progress
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-500"
                            style={{ width: `${totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">
                        {completedChecklist}/{totalChecklist} tasks
                    </span>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-xl p-5"
            >
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Data Management
                </h3>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-1.5" />
                        Export Data (JSON)
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                        <RotateCcw className="h-4 w-4 mr-1.5" />
                        Reset All Data
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
