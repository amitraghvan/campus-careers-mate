/**
 * PythonHeader Component
 * Persistent top bar for Python learning views showing streak, XP,
 * mastery badge, Learning/Exam Mode toggle, and quick tools.
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Flame,
    Zap,
    Trophy,
    GraduationCap,
    BookOpen,
    FileCheck2,
    Calendar,
    ArrowLeft,
    Sparkles,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePythonState } from '../hooks/usePythonState';
import { cn } from '@/lib/utils';

interface PythonHeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    backTo?: string;
    onOpenDailyChallenge?: () => void;
    onOpenMistakeReview?: () => void;
}

export function PythonHeader({
    title,
    subtitle,
    showBack = false,
    backTo,
    onOpenDailyChallenge,
    onOpenMistakeReview,
}: PythonHeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, stats } = usePythonState();

    const isExamMode = location.pathname.includes('/exam-mode');

    const handleToggleMode = () => {
        if (isExamMode) {
            navigate('/python/phase/1');
        } else {
            navigate('/python/phase/1/exam-mode');
        }
    };

    return (
        <div className="border-b border-border/40 bg-card/40 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left: Back / Title */}
                <div className="flex items-center gap-3">
                    {showBack && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-secondary/80"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-base md:text-lg font-display font-bold tracking-tight text-foreground">
                                {title || 'Python Foundations'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                Unit I
                            </span>
                        </div>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Right: Gamification Badges & Mode Switcher */}
                <div className="flex items-center flex-wrap gap-2 md:gap-3">
                    {/* Streak Indicator */}
                    <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold glow-warm cursor-pointer"
                        title={`${state.currentStreak} Day Streak! Best: ${state.bestStreak} days`}
                    >
                        <Flame className="h-4 w-4 text-orange-400 animate-pulse" />
                        <span>{state.currentStreak} Day Streak</span>
                    </div>

                    {/* XP Indicator */}
                    <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold"
                        title="Total Python Experience Points"
                    >
                        <Zap className="h-4 w-4 text-amber-400" />
                        <span>{state.xp} XP</span>
                    </div>

                    {/* Mastery Indicator */}
                    <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                        title={`Overall Unit I Mastery: ${stats.avgMastery}%`}
                    >
                        <Trophy className="h-4 w-4 text-primary" />
                        <span>{stats.masteryLevel} ({stats.avgMastery}%)</span>
                    </div>

                    {/* Mode Toggle (Learning Mode | Exam Mode) */}
                    <div className="flex items-center p-0.5 rounded-lg bg-secondary/80 border border-border/40 text-xs">
                        <button
                            onClick={() => !isExamMode ? null : handleToggleMode()}
                            className={cn(
                                'px-2.5 py-1 rounded-md transition-all font-medium',
                                !isExamMode
                                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <BookOpen className="h-3 w-3 inline mr-1" />
                            Learn
                        </button>
                        <button
                            onClick={() => isExamMode ? null : handleToggleMode()}
                            className={cn(
                                'px-2.5 py-1 rounded-md transition-all font-medium',
                                isExamMode
                                    ? 'bg-accent text-accent-foreground shadow-sm font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <FileCheck2 className="h-3 w-3 inline mr-1" />
                            Exam Mode
                        </button>
                    </div>

                    {/* Quick Action: Daily Challenge */}
                    {onOpenDailyChallenge && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenDailyChallenge}
                            className="h-8 px-2.5 text-xs border-primary/30 text-primary hover:bg-primary/10"
                        >
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Daily
                        </Button>
                    )}

                    {/* Quick Action: Mistakes Review */}
                    {stats.unresolvedMistakesCount > 0 && onOpenMistakeReview && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenMistakeReview}
                            className="h-8 px-2.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            Review ({stats.unresolvedMistakesCount})
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
