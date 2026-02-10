import { useState } from "react";
import { useMomentum } from "@/features/dashboard/contexts/MomentumContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Flame, Plus, Trophy, Zap, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function DailyMomentumWidget() {
    const { state, addGoal, toggleGoal, completeChallenge } = useMomentum();
    const [newGoalText, setNewGoalText] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    if (!state) return null;

    const { goals, challenge, streak, badges } = state;
    const completedGoals = goals.filter(g => g.completed).length;
    const progress = (goals.length > 0 ? (completedGoals / goals.length) * 100 : 0);

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim()) {
            addGoal(newGoalText.trim());
            setNewGoalText("");
            setIsAdding(false);
        }
    };

    return (
        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 shadow-sm border-border/50 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Header: Focus & Streak */}
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                    <h2 className="text-lg font-display font-bold flex items-center gap-2">
                        Today's Focus
                        {streak.currentStreak > 0 && (
                            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 flex items-center gap-1">
                                <Flame className="h-3 w-3 fill-orange-500" />
                                {streak.currentStreak} Day Streak
                            </span>
                        )}
                        {streak.freezeDaysRemaining > 0 && streak.currentStreak > 0 && (
                            <span className="text-xs font-normal text-muted-foreground flex items-center gap-1" title={`${streak.freezeDaysRemaining} grace days left`}>
                                <Shield className="h-3 w-3" />
                            </span>
                        )}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {completedGoals} of {goals.length} goals • {challenge?.completed ? "Challenge Complete" : "1 Challenge Active"}
                    </p>
                </div>

                {/* Badges (Mini view) */}
                <div className="flex -space-x-2">
                    {badges.filter(b => b.unlockedAt).slice(0, 3).map((badge) => (
                        <div key={badge.id} className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-sm" title={badge.name}>
                            {badge.icon}
                        </div>
                    ))}
                    {badges.filter(b => b.unlockedAt).length === 0 && (
                        <div className="h-8 w-8 rounded-full bg-secondary/50 border-2 border-background border-dashed flex items-center justify-center text-xs text-muted-foreground">
                            <Trophy className="h-3 w-3 opacity-50" />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                {/* Left: Daily Goals */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">DAILY GOALS ({goals.length}/3)</h3>
                    </div>

                    <div className="space-y-2">
                        <AnimatePresence>
                            {goals.map((goal) => (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={cn(
                                        "group flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer",
                                        goal.completed ? "bg-primary/5" : "hover:bg-secondary/50"
                                    )}
                                    onClick={() => toggleGoal(goal.id)}
                                >
                                    <div className={cn(
                                        "h-5 w-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
                                        goal.completed ? "bg-primary border-primary" : "border-muted-foreground/30 group-hover:border-primary/50"
                                    )}>
                                        {goal.completed && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
                                    </div>
                                    <span className={cn(
                                        "text-sm flex-1 transition-all",
                                        goal.completed ? "text-muted-foreground line-through" : "text-foreground"
                                    )}>
                                        {goal.text}
                                    </span>
                                    {goal.isRollover && !goal.completed && (
                                        <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Rollover</span>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add Goal Input */}
                        {goals.length < 3 && (
                            <div className="pt-1">
                                {isAdding ? (
                                    <form onSubmit={handleAddGoal} className="flex gap-2">
                                        <Input
                                            autoFocus
                                            value={newGoalText}
                                            onChange={(e) => setNewGoalText(e.target.value)}
                                            placeholder="What's your focus?"
                                            className="h-8 text-sm"
                                            onBlur={() => !newGoalText && setIsAdding(false)}
                                        />
                                        <Button size="sm" type="submit" variant="ghost" className="h-8 w-8 p-0">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-2 py-1.5"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add goal</span>
                                    </button>
                                )}
                            </div>
                        )}
                        {goals.length === 0 && !isAdding && (
                            <p className="text-sm text-muted-foreground/60 italic px-2">No goals set for today. Start small!</p>
                        )}
                    </div>
                </div>

                {/* Right: Daily Challenge */}
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">DAILY CHALLENGE</h3>

                    {challenge && (
                        <div className={cn(
                            "rounded-xl p-4 border transition-all relative overflow-hidden",
                            challenge.completed
                                ? "bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20"
                                : "bg-card border-border hover:border-primary/20"
                        )}>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className={cn(
                                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                                    challenge.completed ? "bg-green-500/20 text-green-600" : "bg-primary/10 text-primary"
                                )}>
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={cn(
                                            "text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wider",
                                            challenge.type === "OUTREACH" ? "bg-blue-500/10 text-blue-600" :
                                                challenge.type === "PREP" ? "bg-purple-500/10 text-purple-600" :
                                                    "bg-gray-500/10 text-gray-600"
                                        )}>
                                            {challenge.type}
                                        </span>
                                        {challenge.completed && (
                                            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> DONE
                                            </span>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-sm font-medium mb-3",
                                        challenge.completed ? "text-muted-foreground" : "text-foreground"
                                    )}>
                                        {challenge.text}
                                    </p>

                                    {!challenge.completed && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                                            onClick={completeChallenge}
                                        >
                                            Mark Complete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar (Subtle bottom line) */}
            <div className="absolute bottom-0 left-0 h-1 bg-primary/10 w-full">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </Card>
    );
}
