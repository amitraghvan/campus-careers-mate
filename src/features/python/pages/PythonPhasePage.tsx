/**
 * PythonPhasePage Component (/python/phase/:phaseId)
 * Hub for Phase 1 (Unit I: Foundations) and Phase 2 (Unit II: Control Flow & Iteration).
 * Renders all chapters, mini-projects, comprehensive final assessment, and revision quick links.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Code2,
    CheckCircle2,
    Lock,
    ArrowRight,
    Trophy,
    Sparkles,
    FileCheck2,
    FolderKanban,
    RotateCcw,
    Layers,
    Clock,
    Zap,
    GraduationCap,
    Dice5,
    Gamepad2,
    Swords,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PythonHeader } from '../components/PythonHeader';
import { ChapterCard } from '../components/ChapterCard';
import { WeakTopicsBanner } from '../components/WeakTopicsBanner';
import { DailyChallengeModal } from '../components/DailyChallengeModal';
import { MistakeReviewDrawer } from '../components/MistakeReviewDrawer';
import { PHASE_1_CHAPTERS, PHASE_1_ASSESSMENT, PHASE_1_PROJECT } from '../data/python-phase1.data';
import { PHASE_2_CHAPTERS, PHASE_2_ASSESSMENT, PHASE_2_PROJECTS } from '../data/python-phase2.data';
import { usePythonState } from '../hooks/usePythonState';
import { cn } from '@/lib/utils';

export default function PythonPhasePage() {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    const { state, stats } = usePythonState();
    const [dailyModalOpen, setDailyModalOpen] = useState(false);
    const [mistakesDrawerOpen, setMistakesDrawerOpen] = useState(false);

    const currentPhase = parseInt(phaseId || '1', 10);
    const isPhase2 = currentPhase === 2;

    const chapters = isPhase2 ? PHASE_2_CHAPTERS : PHASE_1_CHAPTERS;
    const assessment = isPhase2 ? PHASE_2_ASSESSMENT : PHASE_1_ASSESSMENT;
    const isAssessmentPassed = isPhase2
        ? state.phase2AssessmentResult?.passed || false
        : state.assessmentResult?.passed || false;

    // Derived statistics for the current phase
    const totalPhaseLessons = chapters.reduce((acc, c) => acc + c.lessons.length, 0);
    const completedPhaseLessons = chapters.reduce(
        (acc, c) => acc + c.lessons.filter((l) => state.completedLessons.includes(l.id)).length,
        0
    );

    const totalPhaseChallenges = chapters.reduce((acc, c) => acc + c.challenges.length, 0);
    const completedPhaseChallenges = chapters.reduce(
        (acc, c) => acc + c.challenges.filter((ch) => state.completedChallenges.includes(ch.id)).length,
        0
    );

    const passedPhaseQuizzes = chapters.filter((c) => (state.quizScores[c.id] || 0) >= 70).length;

    const phaseProgressPct = Math.min(
        100,
        Math.round(
            (completedPhaseLessons / (totalPhaseLessons || 1)) * 40 +
            (completedPhaseChallenges / (totalPhaseChallenges || 1)) * 30 +
            (passedPhaseQuizzes / (chapters.length || 1)) * 30
        )
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PythonHeader
                title={isPhase2 ? "Phase 2 — Control Flow & Iteration" : "Phase 1 — Python Foundations"}
                subtitle={
                    isPhase2
                        ? "Unit II: Conditional Branching, Random Numbers, while/for Loops, and Pattern Generation"
                        : "Unit I: Environment, Variables, Types, Expressions, and Debugging"
                }
                showBack
                backTo="/python"
                onOpenDailyChallenge={() => setDailyModalOpen(true)}
                onOpenMistakeReview={() => setMistakesDrawerOpen(true)}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                {/* Weak Topic Alert */}
                <WeakTopicsBanner weakTopics={stats.weakTopics} />

                {/* Phase Overview Header Card */}
                <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-secondary/30 p-6 md:p-8 relative overflow-hidden shadow-elevated">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                                    {isPhase2 ? "Unit II Syllabus" : "Unit I Syllabus"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {isPhase2 ? "6–10 hours estimated" : "5–8 hours estimated"} • Beginner → Intermediate
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-black text-foreground tracking-tight">
                                {isPhase2 ? "Control Flow & Iteration" : "Python Fundamentals Mastery"}
                            </h1>
                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                {isPhase2
                                    ? "Learn how to make Python programs think, decide, repeat, and respond. You will learn conditions, Boolean logic, random numbers, loops, nested loops, and techniques for writing reusable program logic."
                                    : "Master the building blocks of Python: interpreter mechanics, variable types, mathematical operations, strings, and debugging foundation."}
                            </p>

                            <div className="pt-2 flex flex-wrap items-center gap-3">
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/python/phase/${currentPhase}/revision`)}
                                    className="bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 text-xs font-bold h-8"
                                >
                                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                    Quick Revision Hub
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/python/phase/${currentPhase}/exam-mode`)}
                                    className="bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 text-xs font-bold h-8"
                                >
                                    <GraduationCap className="h-3.5 w-3.5 mr-1" />
                                    Exam Mode Practice
                                </Button>
                            </div>
                        </div>

                        {/* Phase Progress Ring / Metric */}
                        <div className="p-5 rounded-2xl bg-card/80 border border-border/60 min-w-[240px] space-y-3 shrink-0 shadow-sm backdrop-blur-md">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-muted-foreground">Phase Completion</span>
                                <span className="font-bold text-primary font-mono">{phaseProgressPct}%</span>
                            </div>
                            <Progress value={phaseProgressPct} className="h-2" />
                            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                                <div>
                                    <span className="text-[10px] text-muted-foreground block">Lessons</span>
                                    <span className="text-xs font-bold text-foreground">
                                        {completedPhaseLessons}/{totalPhaseLessons}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground block">Challenges</span>
                                    <span className="text-xs font-bold text-foreground">
                                        {completedPhaseChallenges}/{totalPhaseChallenges}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-muted-foreground block">Quizzes</span>
                                    <span className="text-xs font-bold text-foreground">
                                        {passedPhaseQuizzes}/{chapters.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chapters Section */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-display font-bold text-foreground">Core Chapters</h2>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Step through each chapter from basic decision branching to nested matrix iterations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {chapters.map((chapter, idx) => (
                            <ChapterCard key={chapter.id} chapter={chapter} index={idx} />
                        ))}
                    </div>
                </div>

                {/* Phase Projects Section */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                            <FolderKanban className="h-5 w-5 text-primary" />
                            {isPhase2 ? "Phase 2 Mini Projects" : "Phase 1 Capstone Project"}
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            {isPhase2
                                ? "Apply loops, random numbers, and decision logic to build 3 real interactive games and simulators."
                                : "Prove your mastery and earn the 'Python Foundation' credential."}
                        </p>
                    </div>

                    {isPhase2 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PHASE_2_PROJECTS.map((proj, idx) => {
                                const isDone = state.completedProjects?.includes(proj.id) || false;
                                const icons = [Dice5, Gamepad2, Swords];
                                const ProjectIcon = icons[idx % icons.length];

                                return (
                                    <div
                                        key={proj.id}
                                        className={cn(
                                            'rounded-2xl border p-6 flex flex-col justify-between backdrop-blur-md relative overflow-hidden transition-all shadow-sm',
                                            isDone
                                                ? 'border-emerald-500/40 bg-emerald-950/20'
                                                : 'border-primary/40 bg-card/70 hover:border-primary/60'
                                        )}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold">
                                                        <ProjectIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                                            Project {idx + 1}
                                                        </span>
                                                        <h3 className="text-sm font-display font-bold text-foreground">
                                                            {proj.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {isDone ? (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" /> Built
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">
                                                        Open
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                                {proj.overview}
                                            </p>

                                            <div className="flex items-center justify-between pt-2 border-t border-border/30 text-xs">
                                                <span className="text-amber-400 font-bold">+{proj.xpReward} XP</span>
                                                <span className="text-muted-foreground text-[11px]">Badge: {proj.badgeName}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 mt-2">
                                            <Button
                                                onClick={() => navigate(`/python/phase/2/project/${proj.id}`)}
                                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8"
                                            >
                                                <span>{isDone ? 'View / Rebuild' : 'Build Project'}</span>
                                                <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Phase 1 Single Project Card */}
                            <div className="rounded-2xl border border-primary/40 bg-card/70 p-6 flex flex-col justify-between backdrop-blur-md">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg">
                                                🚀
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                                    Capstone Project
                                                </span>
                                                <h3 className="text-base md:text-lg font-display font-bold text-foreground">
                                                    Personal Profile Generator
                                                </h3>
                                            </div>
                                        </div>

                                        {state.projectCompleted ? (
                                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Project Built!
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                                                Unlocked
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Build a complete Python program that stores variables across all 4 primitive types, computes graduation countdown, and formats a personal profile card.
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-border/30 flex items-center justify-between mt-4">
                                    <span className="text-amber-400 font-bold text-xs">+{PHASE_1_PROJECT.xpReward} XP</span>
                                    <Button
                                        size="sm"
                                        onClick={() => navigate('/python/phase/1/project')}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 h-8"
                                    >
                                        <span>{state.projectCompleted ? 'View Code' : 'Build Project'}</span>
                                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Final Assessment Section */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                            <FileCheck2 className="h-5 w-5 text-accent" />
                            Comprehensive Final Assessment
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Evaluate your full comprehension with conceptual questions, output prediction, code debugging, and live coding.
                        </p>
                    </div>

                    <div className="p-6 md:p-8 rounded-3xl border border-accent/40 bg-gradient-to-r from-accent/15 via-card to-card/60 relative overflow-hidden shadow-elevated">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30">
                                    {isPhase2 ? "Unit II Final Exam" : "Unit I Final Exam"}
                                </span>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                                    {assessment.title}
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
                                    {assessment.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                                    <span>⏱️ {assessment.durationMinutes} Minutes</span>
                                    <span>📝 {assessment.questions.length} Questions ({assessment.sections.length} Sections)</span>
                                    <span className="text-amber-400 font-bold">⭐ +{assessment.xpReward} XP</span>
                                </div>
                            </div>

                            <div className="shrink-0">
                                <Button
                                    onClick={() => navigate(`/python/phase/${currentPhase}/assessment`)}
                                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs px-6 h-10 glow-warm"
                                >
                                    <span>{isAssessmentPassed ? "Review Assessment" : "Take Assessment"}</span>
                                    <ArrowRight className="h-4 w-4 ml-1.5" />
                                </Button>
                            </div>
                        </div>
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
