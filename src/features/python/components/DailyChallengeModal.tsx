/**
 * DailyChallengeModal Component
 * Interactive modal drawer to solve today's daily Python challenge and earn XP.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    X,
    Sparkles,
    CheckCircle2,
    Flame,
    Zap,
    Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PythonEditor } from './PythonEditor';
import { DAILY_PYTHON_CHALLENGES } from '../data/python-phase1.data';
import { usePythonState } from '../hooks/usePythonState';

interface DailyChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DailyChallengeModal({ isOpen, onClose }: DailyChallengeModalProps) {
    const { state, completeDailyChallenge } = usePythonState();
    const [isSuccess, setIsSuccess] = useState(false);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayChallenge = DAILY_PYTHON_CHALLENGES[0]; // Active daily challenge

    const isAlreadyCompleted = state.completedDailyChallenges.includes(todayStr) || isSuccess;

    const handleSuccess = () => {
        setIsSuccess(true);
        completeDailyChallenge(todayStr, todayChallenge.xpReward);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ scale: 0.94, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.94, opacity: 0, y: 10 }}
                    className="relative w-full max-w-2xl bg-card border border-border/70 rounded-2xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto flex flex-col justify-between"
                >
                    {/* Header */}
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                                    <Flame className="h-5 w-5 animate-pulse" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                                            Daily Python Drill
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                                            +{todayChallenge.xpReward} XP
                                        </span>
                                    </div>
                                    <h3 className="text-base md:text-lg font-display font-bold text-foreground">
                                        {todayChallenge.title}
                                    </h3>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Problem Description */}
                        <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs md:text-sm text-foreground/90 mb-4 leading-relaxed font-sans">
                            {todayChallenge.description}
                        </div>

                        {/* Success Banner if already completed */}
                        {isAlreadyCompleted && (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-center justify-between mb-4"
                            >
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                    <div>
                                        <div className="font-bold text-sm">Challenge Solved!</div>
                                        <div className="text-xs opacity-90">
                                            +{todayChallenge.xpReward} XP awarded. Daily streak extended to {state.currentStreak} days!
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Python Editor */}
                        <PythonEditor
                            initialCode={todayChallenge.starterCode}
                            starterCode={todayChallenge.starterCode}
                            testCases={todayChallenge.testCases}
                            onSubmitSuccess={handleSuccess}
                            submitButtonText="Submit & Claim XP"
                        />
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/40 flex justify-end">
                        <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
                            Close
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
