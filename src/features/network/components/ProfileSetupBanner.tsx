import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { peerService } from "../services/peer.service";

interface ProfileSetupBannerProps {
    onProfileCreated: () => void;
}

export function ProfileSetupBanner({ onProfileCreated }: ProfileSetupBannerProps) {
    const [expanded, setExpanded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [college, setCollege] = useState("");
    const [roles, setRoles] = useState("");
    const [headline, setHeadline] = useState("");
    const [stage, setStage] = useState("Preparing");

    const handleSubmit = async () => {
        if (!college.trim() || !roles.trim()) return;
        setSaving(true);
        try {
            await peerService.createProfile({
                college: college.trim(),
                targetJobRoles: roles.split(",").map(r => r.trim()).filter(Boolean),
                placementStage: stage,
                headline: headline.trim() || undefined,
            });
            onProfileCreated();
        } catch (err) {
            console.error("Failed to create profile", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {!expanded ? (
                            <motion.div
                                key="collapsed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Set up your peer profile</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Create your profile so other students can find and connect with you
                                        </p>
                                    </div>
                                </div>
                                <Button onClick={() => setExpanded(true)} className="gap-2">
                                    <UserPlus className="h-4 w-4" /> Create Profile
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="expanded"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Create Your Peer Profile
                                    </h3>
                                    <Button variant="ghost" size="icon" onClick={() => setExpanded(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="college">College *</Label>
                                        <Input
                                            id="college"
                                            placeholder="e.g. IIT Delhi"
                                            value={college}
                                            onChange={(e) => setCollege(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="roles">Target Roles * (comma separated)</Label>
                                        <Input
                                            id="roles"
                                            placeholder="e.g. SDE, Data Analyst"
                                            value={roles}
                                            onChange={(e) => setRoles(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="headline">Headline</Label>
                                        <Input
                                            id="headline"
                                            placeholder="e.g. Final year CSE | DSA enthusiast"
                                            value={headline}
                                            onChange={(e) => setHeadline(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stage">Placement Stage</Label>
                                        <select
                                            id="stage"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={stage}
                                            onChange={(e) => setStage(e.target.value)}
                                        >
                                            <option value="Preparing">Preparing</option>
                                            <option value="Applying">Applying</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Placed">Placed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" onClick={() => setExpanded(false)}>Cancel</Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={saving || !college.trim() || !roles.trim()}
                                        className="gap-2"
                                    >
                                        {saving ? "Creating..." : "Create Profile"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </motion.div>
    );
}
