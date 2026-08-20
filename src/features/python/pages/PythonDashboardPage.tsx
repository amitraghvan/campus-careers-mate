/**
 * PythonDashboardPage Component (/python)
 * Main Python Learning Hub with Phase Roadmap, daily challenge card,
 * active streak, overall mastery, and weak topic alerts.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Flame,
    Zap,
    Trophy,
    BookOpen,
    Code2,
    Calendar,
    Sparkles,
    CheckCircle2,
    Lock,
    ArrowRight,
    GraduationCap,
    Layers,
    Target,
    HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PythonHeader } from '../components/PythonHeader';
import { PhaseCard } from '../components/PhaseCard';
import { WeakTopicsBanner } from '../components/WeakTopicsBanner';
import { DailyChallengeModal } from '../components/DailyChallengeModal';
import { MistakeReviewDrawer } from '../components/MistakeReviewDrawer';
import { PYTHON_ROADMAP_PHASES } from '../data/python-phase1.data';
import { usePythonState } from '../hooks/usePythonState';

export default function PythonDashboardPage() {
    const navigate = useNavigate();
    const { state, stats, badges } = usePythonState();
    const [dailyModalOpen, setDailyModalOpen] = useState(false);
    const [mistakesDrawerOpen, setMistakesDrawerOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <PythonHeader
                title="Python Learning Hub"
                subtitle="Master Python from fundamentals to advanced enterprise systems"
                onOpenDailyChallenge={() => setDailyModalOpen(true)}
                onOpenMistakeReview={() => setMistakesDrawerOpen(true)}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                {/* Weak Topic Alert if any */}
                <WeakTopicsBanner weakTopics={stats.weakTopics} />

                {/* Hero / Phase 1 Highlight Banner */}
                <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/15 via-card to-accent/10 p-6 md:p-8 relative overflow-hidden shadow-elevated">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="max-w-2xl space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                                    Current Enrolled Phase
                                </span>
                                <span className="text-xs text-muted-foreground font-semibold">
                                    Unit I • Python Fundamentals
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black tracking-tight text-foreground">
                                Phase 1 — Python Foundations
                            </h1>

                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                Start your programming journey from absolute zero. Learn how Python works, write your first programs, manipulate variables and types, evaluate expressions, and master error debugging.
                            </p>

                            {/* Progress bar inside hero */}
                            <div className="pt-2 space-y-2">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-foreground">Phase 1 Progress</span>
                                    <span className="text-primary font-mono font-bold">
                                        {stats.overallPhaseProgressPct}% Completed
                                    </span>
                                </div>
                                <Progress value={stats.overallPhaseProgressPct} className="h-3 bg-secondary/80" />
                            </div>
                        </div>

                        {/* Right Quick Actions */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                            <Button
                                onClick={() => navigate('/python/phase/1')}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5 rounded-xl shadow-md glow-primary text-sm"
                            >
                                <span>Continue Phase 1</span>
                                <ArrowRight className="h-4 w-4 ml-1.5" />
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setDailyModalOpen(true)}
                                className="border-border/60 hover:bg-secondary/80 text-xs py-5 rounded-xl"
                            >
                                <Calendar className="h-4 w-4 mr-1.5 text-orange-400" />
                                <span>Solve Daily Challenge (+35 XP)</span>
                            </Button>
                        </div>
                    </div>

                    {/* Stats strip below hero */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/40 text-xs">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Lessons</span>
                                <span className="font-semibold text-foreground font-mono">
                                    {stats.completedLessonsCount} / {stats.totalLessons}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold">
                                <Code2 className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Practice Drills</span>
                                <span className="font-semibold text-foreground font-mono">
                                    {stats.completedChallengesCount} / {stats.totalChallenges}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                                <Flame className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Active Streak</span>
                                <span className="font-semibold text-foreground font-mono">
                                    {state.currentStreak} Days
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-300 flex items-center justify-center font-bold">
                                <Zap className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px]">Total XP</span>
                                <span className="font-semibold text-foreground font-mono">
                                    {state.xp} XP
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badge Showcase */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg md:text-xl font-display font-bold text-foreground">
                                Phase 1 Milestones & Badges
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Earn badges as you progress through lessons, quizzes, and projects.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {badges.map((badge) => (
                            <div
                                key={badge.id}
                                className={`rounded-xl border p-4 text-center transition-all ${
                                    badge.isUnlocked
                                        ? 'border-amber-500/40 bg-amber-950/20 text-amber-300 shadow-sm'
                                        : 'border-border/30 bg-secondary/20 text-muted-foreground/60 opacity-60'
                                }`}
                            >
                                <div className="text-3xl mb-2">{badge.icon}</div>
                                <div className="text-xs font-bold text-foreground line-clamp-1">
                                    {badge.title}
                                </div>
                                <div className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
                                    {badge.description}
                                </div>
                                {badge.isUnlocked ? (
                                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300">
                                        Unlocked
                                    </span>
                                ) : (
                                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-medium bg-secondary text-muted-foreground">
                                        +{badge.xpValue} XP
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Complete Curriculum Roadmap (Phases 1 to 6) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg md:text-xl font-display font-bold text-foreground">
                                Complete Python Career Curriculum
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Phase 1 is fully available. Complete Phase 1 to build foundational mastery for advanced units.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {PYTHON_ROADMAP_PHASES.map((phase, idx) => (
                            <PhaseCard key={phase.id} phase={phase} index={idx} />
                        ))}
                    </div>
                </div>
            </main>

            {/* Modals & Drawers */}
            <DailyChallengeModal
                isOpen={dailyModalOpen}
                onClose={() => setDailyModalOpen(false)}
            />

            <MistakeReviewDrawer
                isOpen={mistakesDrawerOpen}
                onClose={() => setMistakesDrawerOpen(false)}
            />
        </div>
    );
}
