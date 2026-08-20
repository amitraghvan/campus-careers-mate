/**
 * PhaseCard Component
 * Visual card for roadmap phases (Phase 1 active, Phases 2-6 locked with coming soon badge).
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Lock,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    BookOpen,
    Clock,
    Zap,
    Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PythonPhase } from '../types/python.types';
import { usePythonState } from '../hooks/usePythonState';
import { cn } from '@/lib/utils';

interface PhaseCardProps {
    phase: PythonPhase;
    index: number;
}

export function PhaseCard({ phase, index }: PhaseCardProps) {
    const navigate = useNavigate();
    const { stats } = usePythonState();

    const isUnlocked = !phase.isLocked;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className={cn(
                'rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-md shadow-sm',
                isUnlocked
                    ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-card/90 to-card/70 glow-primary'
                    : 'border-border/40 bg-card/30 opacity-75 grayscale-[0.3]'
            )}
        >
            {/* Background Glow for Unlocked Phases */}
            {isUnlocked && (
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            )}

            <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                'h-12 w-12 rounded-xl flex items-center justify-center text-2xl font-bold border shrink-0',
                                isUnlocked
                                    ? 'bg-primary/15 border-primary/30 text-primary shadow-sm'
                                    : 'bg-secondary border-border/40 text-muted-foreground'
                            )}
                        >
                            {phase.badgeIcon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-primary tracking-wider uppercase">
                                    {phase.unit}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary border border-border/40 text-muted-foreground">
                                    {phase.difficulty}
                                </span>
                            </div>
                            <h3 className="text-lg md:text-xl font-display font-bold text-foreground mt-0.5">
                                {phase.title}
                            </h3>
                        </div>
                    </div>

                    {isUnlocked ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-bold">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Active</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 text-muted-foreground border border-border/50 text-xs font-semibold">
                            <Lock className="h-3.5 w-3.5" />
                            <span>Coming Soon</span>
                        </div>
                    )}
                </div>

                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                    {phase.description}
                </p>

                {/* Progress Meter for Phase 1 */}
                {phase.id === 1 && (
                    <div className="space-y-2 mb-5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                            <span>Phase 1 Completion</span>
                            <span className="font-bold text-foreground font-mono">
                                {stats.overallPhaseProgressPct}%
                            </span>
                        </div>
                        <Progress
                            value={stats.overallPhaseProgressPct}
                            className="h-2.5 bg-secondary/60"
                        />
                    </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-secondary/20 border border-border/30 text-xs mb-5">
                    <div>
                        <span className="text-[11px] text-muted-foreground block">Duration</span>
                        <span className="font-semibold text-foreground">{phase.estimatedHours}</span>
                    </div>
                    <div className="border-x border-border/30 px-2 text-center">
                        <span className="text-[11px] text-muted-foreground block">Curriculum</span>
                        <span className="font-semibold text-foreground">
                            {phase.totalChapters} Ch • {phase.totalLessons} Lessons
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-[11px] text-muted-foreground block">Reward</span>
                        <span className="font-semibold text-amber-400">+{phase.totalXP} XP</span>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    Badge: <strong className="text-foreground">{phase.badgeName}</strong>
                </span>

                {isUnlocked ? (
                    <Button
                        size="sm"
                        onClick={() => navigate(`/python/phase/${phase.id}`)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 h-8 glow-primary"
                    >
                        <span>Enter Phase {phase.id}</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled
                        className="text-xs px-3 h-8 cursor-not-allowed opacity-60"
                    >
                        <Lock className="h-3.5 w-3.5 mr-1" />
                        Locked
                    </Button>
                )}
            </div>
        </motion.div>
    );
}
