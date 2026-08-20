/**
 * MistakeReviewDrawer Component
 * Review previously failed questions, debug errors, and mark them resolved.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle2,
    X,
    RotateCcw,
    Sparkles,
    HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePythonState } from '../hooks/usePythonState';
import { PythonMistake } from '../types/python.types';

interface MistakeReviewDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MistakeReviewDrawer({ isOpen, onClose }: MistakeReviewDrawerProps) {
    const { state, resolveMistake } = usePythonState();
    const [selectedMistake, setSelectedMistake] = useState<PythonMistake | null>(null);

    const unresolved = state.mistakes.filter((m) => !m.resolved);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-end">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Drawer */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-md h-full bg-card border-l border-border/60 shadow-2xl z-10 p-6 flex flex-col justify-between overflow-y-auto"
                >
                    <div>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
                                    <AlertCircle className="h-4.5 w-4.5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-display font-bold text-foreground">
                                        Mistake Review Arena
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {unresolved.length} concept{unresolved.length === 1 ? '' : 's'} to review
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* List of Mistakes */}
                        {unresolved.length === 0 ? (
                            <div className="text-center py-16 space-y-3">
                                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h4 className="font-bold text-foreground text-sm">No Pending Mistakes!</h4>
                                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                    You have resolved all recorded errors. Keep up the high precision!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {unresolved.map((mistake) => (
                                    <div
                                        key={mistake.id}
                                        className="p-3.5 rounded-xl border border-border/60 bg-secondary/20 space-y-2 text-xs"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-primary uppercase text-[10px] tracking-wider">
                                                {mistake.topic}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(mistake.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className="font-semibold text-foreground leading-snug">
                                            {mistake.questionText}
                                        </p>

                                        {mistake.codeSnippet && (
                                            <pre className="p-2 rounded bg-[#0d1117] border border-border/30 font-mono text-[11px] text-emerald-300 overflow-auto">
                                                {mistake.codeSnippet}
                                            </pre>
                                        )}

                                        <div className="p-2 rounded bg-amber-950/20 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                                            <strong>Why: </strong> {mistake.explanation}
                                        </div>

                                        <div className="flex items-center justify-end pt-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => resolveMistake(mistake.id)}
                                                className="h-7 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                            >
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Mark Understood
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/40">
                        <Button variant="secondary" onClick={onClose} className="w-full text-xs">
                            Done Reviewing
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
