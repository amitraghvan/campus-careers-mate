/**
 * PythonChapterPage Component (/python/phase/:phaseId/chapter/:chapterId)
 * Displays chapter syllabus, full list of lessons with completion status,
 * practice launcher, quiz status, and navigation for Phase 1 and Phase 2.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Code2,
    CheckCircle2,
    Circle,
    ArrowRight,
    Trophy,
    FileQuestion,
    Clock,
    Zap,
    Lock,
    Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PythonHeader } from '../components/PythonHeader';
import { DailyChallengeModal } from '../components/DailyChallengeModal';
import { MistakeReviewDrawer } from '../components/MistakeReviewDrawer';
import { PHASE_1_CHAPTERS } from '../data/python-phase1.data';
import { PHASE_2_CHAPTERS } from '../data/python-phase2.data';
import { usePythonState } from '../hooks/usePythonState';
import { cn } from '@/lib/utils';

const ALL_CHAPTERS = [...PHASE_1_CHAPTERS, ...PHASE_2_CHAPTERS];

export default function PythonChapterPage() {
    const { phaseId, chapterId } = useParams();
    const navigate = useNavigate();
    const { state } = usePythonState();
    const [dailyModalOpen, setDailyModalOpen] = useState(false);
    const [mistakesDrawerOpen, setMistakesDrawerOpen] = useState(false);

    const cId = parseInt(chapterId || '1', 10);
    const chapter = ALL_CHAPTERS.find((c) => c.id === cId) || ALL_CHAPTERS[0];
    const currentPhase = chapter.id <= 3 ? 1 : 2;

    const isUnlocked = true;
    const totalLessons = chapter.lessons.length;
    const completedLessons = chapter.lessons.filter((l) =>
        state.completedLessons.includes(l.id)
    ).length;

    const totalChallenges = chapter.challenges.length;
    const completedChallenges = chapter.challenges.filter((c) =>
        state.completedChallenges.includes(c.id)
    ).length;

    const quizScore = state.quizScores[chapter.id];
    const isQuizPassed = quizScore !== undefined && quizScore >= 70;

    const lessonPct = Math.round((completedLessons / totalLessons) * 100);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PythonHeader
                title={`Chapter ${chapter.chapterNumber}: ${chapter.title}`}
                subtitle={chapter.subtitle}
                showBack
                backTo={`/python/phase/${currentPhase}`}
                onOpenDailyChallenge={() => setDailyModalOpen(true)}
                onOpenMistakeReview={() => setMistakesDrawerOpen(true)}
            />

            <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                {/* Chapter Banner */}
                <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-card/60 p-6 md:p-8 relative overflow-hidden shadow-elevated">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                    Chapter {chapter.chapterNumber} Syllabus
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/20">
                                    +{chapter.xpReward} Completion XP
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-display font-black text-foreground">
                                {chapter.title}
                            </h1>

                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                {chapter.description}
                            </p>

                            {/* Progress bar */}
                            <div className="pt-2 space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                                    <span>Lessons Completed</span>
                                    <span className="font-mono text-foreground font-bold">
                                        {completedLessons} / {totalLessons} ({lessonPct}%)
                                    </span>
                                </div>
                                <Progress value={lessonPct} className="h-2.5 bg-secondary/80" />
                            </div>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                            <Button
                                onClick={() => navigate(`/python/phase/${currentPhase}/chapter/${chapter.id}/practice`)}
                                className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold px-4 h-9 shadow-sm"
                            >
                                <Code2 className="h-4 w-4 mr-1.5" />
                                <span>Practice Arena ({completedChallenges}/{totalChallenges})</span>
                            </Button>

                            <Button
                                onClick={() => navigate(`/python/phase/${currentPhase}/chapter/${chapter.id}/quiz`)}
                                variant={isQuizPassed ? 'secondary' : 'default'}
                                className={cn(
                                    'text-xs font-semibold px-4 h-9 shadow-sm',
                                    !isQuizPassed && 'bg-primary hover:bg-primary/90 text-primary-foreground glow-primary'
                                )}
                            >
                                <FileQuestion className="h-4 w-4 mr-1.5" />
                                <span>{isQuizPassed ? `Quiz Passed (${quizScore}%)` : 'Take Chapter Quiz'}</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Lessons List Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-display font-bold text-foreground">
                                Chapter Curriculum ({chapter.lessons.length} Lessons)
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Follow the lessons sequentially to build rock-solid foundational intuition.
                            </p>
                        </div>

                        <span className="text-xs font-mono font-bold text-muted-foreground bg-secondary/40 px-3 py-1 rounded-lg border border-border/40">
                            {completedLessons} / {totalLessons} Done
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {chapter.lessons.map((lesson, idx) => {
                            const isCompleted = state.completedLessons.includes(lesson.id);

                            return (
                                <motion.div
                                    key={lesson.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    onClick={() =>
                                        navigate(
                                            `/python/phase/${currentPhase}/chapter/${chapter.id}/lesson/${lesson.id}`
                                        )
                                    }
                                    className={cn(
                                        'p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 backdrop-blur-md',
                                        isCompleted
                                            ? 'bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/60'
                                            : 'bg-card/70 border-border/60 hover:border-primary/60 hover:bg-card/90'
                                    )}
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        {/* Status Icon */}
                                        <div
                                            className={cn(
                                                'h-9 w-9 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs',
                                                isCompleted
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-secondary text-muted-foreground border border-border/40'
                                            )}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : (
                                                <span>{lesson.lessonNumber}</span>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-semibold text-primary uppercase">
                                                    Lesson {lesson.lessonNumber}
                                                </span>
                                                <span className="text-xs text-muted-foreground">•</span>
                                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {lesson.durationMinutes} mins
                                                </span>
                                            </div>
                                            <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-1 mt-0.5">
                                                {lesson.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                {lesson.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Action */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                            <Zap className="h-3 w-3 text-amber-400" />
                                            +{lesson.xpReward} XP
                                        </span>

                                        <Button
                                            size="sm"
                                            variant={isCompleted ? 'secondary' : 'default'}
                                            className={cn(
                                                'text-xs h-8 px-3.5',
                                                !isCompleted && 'bg-primary hover:bg-primary/90 text-primary-foreground glow-primary'
                                            )}
                                        >
                                            <span>{isCompleted ? 'Review' : 'Start'}</span>
                                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                        </Button>
                                    </div>
                                </motion.div>
                            );
                        })}
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
