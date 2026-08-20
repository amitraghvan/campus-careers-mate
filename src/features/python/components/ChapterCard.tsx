/**
 * ChapterCard Component
 * Displays chapter overview, completion progress, quiz score, and action button.
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Code2,
    CheckCircle2,
    Lock,
    ArrowRight,
    Trophy,
    Sparkles,
    FileQuestion,
    Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PythonChapter } from '../types/python.types';
import { usePythonState } from '../hooks/usePythonState';
import { cn } from '@/lib/utils';

interface ChapterCardProps {
    chapter: PythonChapter;
    index: number;
}

export function ChapterCard({ chapter, index }: ChapterCardProps) {
    const navigate = useNavigate();
    const { state } = usePythonState();

    const isUnlocked = true;

    // Calculate lesson & challenge stats
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

    // Overall Chapter Percentage (50% lessons, 30% challenges, 20% quiz)
    const lessonPct = (completedLessons / totalLessons) * 50;
    const challengePct = (completedChallenges / totalChallenges) * 30;
    const quizPct = isQuizPassed ? 20 : ((quizScore || 0) / 100) * 20;
    const overallPct = Math.min(100, Math.round(lessonPct + challengePct + quizPct));

    const isComplete = completedLessons === totalLessons && completedChallenges === totalChallenges && isQuizPassed;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={cn(
                'rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between p-5 md:p-6 backdrop-blur-md shadow-sm',
                isUnlocked
                    ? isComplete
                        ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-card/80 to-card/60 glow-primary'
                        : 'border-border/60 bg-gradient-to-br from-card/90 via-card/70 to-card/50 hover:border-primary/40'
                    : 'border-border/30 bg-card/20 opacity-70 grayscale-[0.5]'
            )}
        >
            {/* Top Row: Chapter Badge & Lock State */}
            <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                        <div
                            className={cn(
                                'h-10 w-10 rounded-xl flex items-center justify-center text-xl font-bold border shrink-0',
                                isUnlocked
                                    ? 'bg-primary/10 border-primary/20 text-primary'
                                    : 'bg-secondary border-border/40 text-muted-foreground'
                            )}
                        >
                            {chapter.badgeIcon}
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                Chapter {chapter.chapterNumber}
                            </span>
                            <h3 className="text-base md:text-lg font-display font-bold text-foreground line-clamp-1">
                                {chapter.title}
                            </h3>
                        </div>
                    </div>

                    {!isUnlocked ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/80 text-muted-foreground text-xs font-semibold border border-border/40">
                            <Lock className="h-3.5 w-3.5" />
                            <span>Locked</span>
                        </div>
                    ) : isComplete ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Complete</span>
                        </div>
                    ) : (
                        <span className="text-xs font-bold font-mono text-primary">
                            {overallPct}%
                        </span>
                    )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {chapter.subtitle}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-5">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                        <span>Progress</span>
                        <span>{overallPct}% Completed</span>
                    </div>
                    <Progress value={overallPct} className="h-2 bg-secondary/60" />
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-secondary/30 border border-border/30 text-xs mb-5">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-[11px] mb-0.5">
                            <BookOpen className="h-3 w-3 text-primary" />
                            <span>Lessons</span>
                        </div>
                        <span className="font-semibold text-foreground font-mono">
                            {completedLessons}/{totalLessons}
                        </span>
                    </div>

                    <div className="text-center border-x border-border/30">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-[11px] mb-0.5">
                            <Code2 className="h-3 w-3 text-accent" />
                            <span>Practice</span>
                        </div>
                        <span className="font-semibold text-foreground font-mono">
                            {completedChallenges}/{totalChallenges}
                        </span>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-[11px] mb-0.5">
                            <FileQuestion className="h-3 w-3 text-amber-400" />
                            <span>Quiz</span>
                        </div>
                        <span className="font-semibold text-foreground font-mono">
                            {quizScore !== undefined ? `${quizScore}%` : 'Not taken'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/30">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>~{chapter.estimatedMinutes} mins</span>
                    <span className="mx-1">•</span>
                    <span className="text-amber-400 font-semibold">+{chapter.xpReward} XP</span>
                </div>

                {isUnlocked ? (
                    <Button
                        size="sm"
                        onClick={() => navigate(`/python/phase/1/chapter/${chapter.id}`)}
                        className={cn(
                            'text-xs font-semibold px-4 h-8 transition-all',
                            isComplete
                                ? 'bg-secondary hover:bg-secondary/80 text-foreground'
                                : 'bg-primary hover:bg-primary/90 text-primary-foreground glow-primary'
                        )}
                    >
                        <span>{isComplete ? 'Review Chapter' : completedLessons > 0 ? 'Continue' : 'Start Learning'}</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                ) : (
                    <span className="text-[11px] text-muted-foreground/80 italic">
                        Pass Chapter {chapter.chapterNumber - 1} Quiz (≥70%) to unlock
                    </span>
                )}
            </div>
        </motion.div>
    );
}
