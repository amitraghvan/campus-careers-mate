/**
 * AIHintSystem Component
 * Progressive 4-level hint revealing system + Full Solution with explanation.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Eye,
    EyeOff,
    CheckCircle,
    HelpCircle,
    KeyRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIHint } from '../types/python.types';
import { cn } from '@/lib/utils';

interface AIHintSystemProps {
    challengeId: string;
    hints: AIHint[];
    solutionCode?: string;
    solutionExplanation?: string;
    currentRevealedLevel?: number;
    onRevealLevel?: (level: number) => void;
}

export function AIHintSystem({
    challengeId,
    hints,
    solutionCode,
    solutionExplanation,
    currentRevealedLevel = 0,
    onRevealLevel,
}: AIHintSystemProps) {
    const [revealedLevel, setRevealedLevel] = useState<number>(currentRevealedLevel);
    const [showSolution, setShowSolution] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [confirmSolutionReveal, setConfirmSolutionReveal] = useState(false);

    const handleUnlockNextHint = () => {
        const next = Math.min(hints.length, revealedLevel + 1);
        setRevealedLevel(next);
        onRevealLevel?.(next);
    };

    const handleRevealSolution = () => {
        setShowSolution(true);
        setConfirmSolutionReveal(false);
    };

    return (
        <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
            {/* Header / Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-secondary/40 transition-colors text-left"
            >
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Lightbulb className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                                Need a Hint? (AI Assistant)
                            </span>
                            {revealedLevel > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300">
                                    Hint {revealedLevel}/{hints.length}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Progressive hints: Concept → Approach → Pseudocode → Guidance
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border/40 p-4 space-y-4 bg-secondary/10"
                    >
                        {/* Revealed Hints */}
                        {revealedLevel === 0 && !showSolution && (
                            <div className="text-center py-4 space-y-2">
                                <p className="text-xs text-muted-foreground">
                                    Try solving it on your own first! If you get stuck, unlock progressive clues without spoiling the solution.
                                </p>
                                <Button
                                    size="sm"
                                    onClick={handleUnlockNextHint}
                                    className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-sm"
                                >
                                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                                    Unlock Hint 1 (Conceptual Clue)
                                </Button>
                            </div>
                        )}

                        <div className="space-y-3">
                            {hints.slice(0, revealedLevel).map((hint, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-lg border border-amber-500/20 bg-amber-950/10 text-xs space-y-1"
                                >
                                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                                        <Lightbulb className="h-3.5 w-3.5" />
                                        <span>
                                            Hint {hint.level}: {hint.title}
                                        </span>
                                    </div>
                                    <p className="text-foreground/90 leading-relaxed font-sans">
                                        {hint.content}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Next Hint Button */}
                        {revealedLevel > 0 && revealedLevel < hints.length && (
                            <div className="pt-2 flex justify-start">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleUnlockNextHint}
                                    className="text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                                >
                                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                                    Unlock Hint {revealedLevel + 1}
                                </Button>
                            </div>
                        )}

                        {/* Solution Section */}
                        {solutionCode && (
                            <div className="pt-3 border-t border-border/30">
                                {!showSolution ? (
                                    confirmSolutionReveal ? (
                                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 space-y-2 text-xs">
                                            <p className="font-semibold text-destructive">
                                                Are you sure you want to reveal the full solution?
                                            </p>
                                            <p className="text-muted-foreground text-[11px]">
                                                Reviewing the solution before solving will reduce the XP reward for this challenge.
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={handleRevealSolution}
                                                    className="h-7 text-xs"
                                                >
                                                    Yes, Reveal Solution
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setConfirmSolutionReveal(false)}
                                                    className="h-7 text-xs"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setConfirmSolutionReveal(true)}
                                            className="text-xs text-muted-foreground hover:text-foreground"
                                        >
                                            <KeyRound className="h-3.5 w-3.5 mr-1" />
                                            Reveal Complete Solution
                                        </Button>
                                    )
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="h-3.5 w-3.5" /> Official Solution & Explanation
                                            </span>
                                            <button
                                                onClick={() => setShowSolution(false)}
                                                className="text-[11px] text-muted-foreground hover:text-foreground"
                                            >
                                                Hide
                                            </button>
                                        </div>
                                        <pre className="p-3 rounded bg-[#0d1117] border border-border/40 font-mono text-xs text-emerald-300 overflow-auto">
                                            {solutionCode}
                                        </pre>
                                        {solutionExplanation && (
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {solutionExplanation}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
