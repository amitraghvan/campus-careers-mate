/**
 * Profile Page — user profile, stats, and data management.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User, Mail, GraduationCap, Calendar, Award, Target,
    TrendingUp, Download, RotateCcw, CheckCircle2, BarChart3,
    Shield, Briefcase, BookOpen, Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import type { AcademicProfile } from "@/features/auth/types";
import { opportunityService } from "@/services";
import { formatDate } from "@/utils/date";

type CustomMetadata = {
    college?: string;
    academic?: AcademicProfile;
};

const defaultAcademic = {
    degree: "",
    branch: "",
    currentCGPA: "",
    twelfthMarks: "",
    tenthMarks: "",
    backlogs: "",
    skills: "",
    resumeLink: ""
};

export default function ProfilePage() {
    const { user } = useUser();
    const opportunities = opportunityService.getAll();
    const [isEditing, setIsEditing] = useState(false);

    // Local state for form fields

    const userMetadata = (user?.unsafeMetadata as CustomMetadata) || {};

    const [formData, setFormData] = useState({
        name: user?.fullName || "",
        college: userMetadata.college || "",
        academic: userMetadata.academic || defaultAcademic
    });

    // Update local state when user data loads/changes
    useEffect(() => {
        if (user) {
            const meta = (user.unsafeMetadata as CustomMetadata) || {};
            setFormData({
                name: user.fullName || "",
                college: meta.college || "",
                academic: meta.academic || defaultAcademic
            });
        }
    }, [user]);

    const handleAcademicChange = (field: keyof AcademicProfile, value: string) => {
        setFormData(prev => ({
            ...prev,
            academic: {
                ...prev.academic,
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        if (!user) return;
        try {
            // If they changed their name, update Clerk's standard name fields
            if (formData.name !== user.fullName) {
                const parts = formData.name.split(" ");
                await user.update({
                    firstName: parts[0] || "",
                    lastName: parts.slice(1).join(" ") || ""
                });
            }

            // Update custom data in Clerk's unsafeMetadata
            await user.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    college: formData.college,
                    academic: formData.academic
                }
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

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
            user: { name: user?.fullName, email: user?.primaryEmailAddress?.emailAddress, college: (user?.unsafeMetadata as CustomMetadata)?.college },
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

            {/* User card with Academic Details */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-6"
            >
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary shrink-0">
                            <User className="h-9 w-9 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-display font-bold">{user?.fullName || "User"}</h2>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{user?.primaryEmailAddress?.emailAddress}</span>
                                {(user?.unsafeMetadata as CustomMetadata)?.college && <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" />{(user?.unsafeMetadata as CustomMetadata).college}</span>}
                                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Joined {user?.createdAt ? formatDate(new Date(user.createdAt).toISOString()) : "N/A"}</span>
                            </div>
                        </div>
                        <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)} className="shrink-0">
                            {isEditing ? "Done Editing" : "Edit Profile"}
                        </Button>
                    </div>

                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/30 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">College</label>
                                <Input value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} placeholder="College Name" />
                            </div>

                            <div className="col-span-full border-t border-border/30 my-2" />
                            <h3 className="col-span-full text-sm font-semibold flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Academic Details
                            </h3>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Degree</label>
                                <Input
                                    value={formData.academic?.degree || ""}
                                    onChange={(e) => handleAcademicChange('degree', e.target.value)}
                                    placeholder="e.g. B.Tech"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Branch</label>
                                <Input
                                    value={formData.academic?.branch || ""}
                                    onChange={(e) => handleAcademicChange('branch', e.target.value)}
                                    placeholder="e.g. CSE"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Current CGPA</label>
                                <Input
                                    value={formData.academic?.currentCGPA || ""}
                                    onChange={(e) => handleAcademicChange('currentCGPA', e.target.value)}
                                    placeholder="e.g. 8.5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">12th Marks (%)</label>
                                <Input
                                    value={formData.academic?.twelfthMarks || ""}
                                    onChange={(e) => handleAcademicChange('twelfthMarks', e.target.value)}
                                    placeholder="e.g. 92%"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">10th Marks (%)</label>
                                <Input
                                    value={formData.academic?.tenthMarks || ""}
                                    onChange={(e) => handleAcademicChange('tenthMarks', e.target.value)}
                                    placeholder="e.g. 95%"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Backlogs</label>
                                <Input
                                    value={formData.academic?.backlogs || ""}
                                    onChange={(e) => handleAcademicChange('backlogs', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Skills (Comma separated)</label>
                                <Input
                                    value={formData.academic?.skills || ""}
                                    onChange={(e) => handleAcademicChange('skills', e.target.value)}
                                    placeholder="e.g. React, Node.js, Python"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Resume Actions</label>
                                <Input
                                    value={formData.academic?.resumeLink || ""}
                                    onChange={(e) => handleAcademicChange('resumeLink', e.target.value)}
                                    placeholder="Resume Drive Link"
                                />
                            </div>

                            <div className="col-span-full pt-4 flex justify-end gap-2">
                                <Button
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/30">
                            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                                <p className="text-xs text-muted-foreground">Degree</p>
                                <p className="font-semibold">{((user?.unsafeMetadata as CustomMetadata)?.academic as AcademicProfile)?.degree || "Not set"}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                                <p className="text-xs text-muted-foreground">Branch</p>
                                <p className="font-semibold">{((user?.unsafeMetadata as CustomMetadata)?.academic as AcademicProfile)?.branch || "Not set"}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                                <p className="text-xs text-muted-foreground">CGPA</p>
                                <p className="font-semibold">{((user?.unsafeMetadata as CustomMetadata)?.academic as AcademicProfile)?.currentCGPA || "N/A"}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                                <p className="text-xs text-muted-foreground">Skills</p>
                                <p className="font-semibold truncate" title={((user?.unsafeMetadata as CustomMetadata)?.academic as AcademicProfile)?.skills}>{((user?.unsafeMetadata as CustomMetadata)?.academic as AcademicProfile)?.skills || "None"}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                                <p className="text-xs text-muted-foreground">12th Grade</p>
                                <p className="font-semibold">{((user?.unsafeMetadata as CustomMetadata)?.academic as AcademicProfile)?.twelfthMarks || "N/A"}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                                <p className="text-xs text-muted-foreground">Backlogs</p>
                                <p className={`font-semibold ${Number(((user?.unsafeMetadata as CustomMetadata)?.academic as AcademicProfile)?.backlogs) > 0 ? "text-destructive" : "text-success"}`}>
                                    {((user?.unsafeMetadata as CustomMetadata)?.academic as AcademicProfile)?.backlogs || "0"}
                                </p>
                            </div>
                            {((user?.unsafeMetadata as CustomMetadata)?.academic as AcademicProfile)?.resumeLink && (
                                <div className="col-span-full mt-2">
                                    <a
                                        href={((user?.unsafeMetadata as CustomMetadata).academic as AcademicProfile).resumeLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Download className="h-3 w-3" /> View Resume
                                    </a>
                                </div>
                            )}
                        </div>
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

