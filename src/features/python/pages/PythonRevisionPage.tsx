/**
 * PythonRevisionPage Component (/python/phase/:phaseId/revision)
 * Unit I and Unit II Quick Revision: Key definitions, syntax cheat-sheets, common pitfalls, and Mistake Review arena.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    RotateCcw,
    BookOpen,
    AlertCircle,
    CheckCircle2,
    Code2,
    Sparkles,
    Check,
    Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PythonHeader } from '../components/PythonHeader';
import { MistakeReviewDrawer } from '../components/MistakeReviewDrawer';
import { UNIT_1_EXAM_REVISION } from '../data/python-phase1.data';
import { UNIT_2_EXAM_REVISION } from '../data/python-phase2.data';
import { usePythonState } from '../hooks/usePythonState';

export default function PythonRevisionPage() {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    const { state, stats } = usePythonState();
    const [mistakesDrawerOpen, setMistakesDrawerOpen] = useState(false);

    const currentPhase = parseInt(phaseId || '1', 10);
    const revision = currentPhase === 2 ? UNIT_2_EXAM_REVISION : UNIT_1_EXAM_REVISION;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PythonHeader
                title={`Unit ${currentPhase === 2 ? 'II' : 'I'} Quick Revision Hub`}
                subtitle="High-yield concepts, syntax cheat-sheets, and mistake review"
                showBack
                backTo={`/python/phase/${currentPhase}`}
                onOpenMistakeReview={() => setMistakesDrawerOpen(true)}
            />

            <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8 pb-16">
                {/* Header Card */}
                <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-card/60 p-6 md:p-8 relative overflow-hidden shadow-elevated">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                                Phase {currentPhase} Revision
                            </span>
                            <h1 className="text-2xl md:text-3xl font-display font-black text-foreground">
                                {revision.unitTitle}
                            </h1>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Review core terms, syntax rules, and avoid common beginner bugs before exams.
                            </p>
                        </div>

                        {stats.unresolvedMistakesCount > 0 && (
                            <Button
                                onClick={() => setMistakesDrawerOpen(true)}
                                className="bg-destructive hover:bg-destructive/90 text-white font-bold text-xs h-9 px-4 shrink-0 shadow-sm"
                            >
                                <AlertCircle className="h-4 w-4 mr-1.5" />
                                <span>Review {stats.unresolvedMistakesCount} Logged Mistakes</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* 1. Key Definitions */}
                <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-display font-bold text-foreground flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Essential Definitions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {revision.keyDefinitions.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md space-y-1.5"
                            >
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                    {item.term}
                                </span>
                                <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                                    {item.definition}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Syntax Cheat-Sheet */}
                <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-display font-bold text-foreground flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-accent" />
                        Unit {currentPhase === 2 ? 'II' : 'I'} Syntax Cheat-Sheet
                    </h2>

                    <div className="rounded-2xl border border-border/50 bg-card/60 overflow-hidden">
                        <div className="divide-y divide-border/30 font-mono text-xs">
                            {revision.syntaxCheatsheet.map((row, idx) => (
                                <div
                                    key={idx}
                                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-secondary/30 transition-colors"
                                >
                                    <code className="text-emerald-300 font-bold whitespace-pre-wrap">{row.syntax}</code>
                                    <span className="font-sans text-xs text-muted-foreground">
                                        {row.purpose}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Common Beginner Pitfalls */}
                <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-display font-bold text-foreground flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-rose-400" />
                        Common Beginner Pitfalls & Fixes
                    </h2>

                    <div className="space-y-3">
                        {revision.commonPitfalls.map((pitfall, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl border border-rose-500/20 bg-rose-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                            >
                                <div className="space-y-0.5">
                                    <span className="font-bold text-rose-400 block">
                                        Mistake: {pitfall.pitfall}
                                    </span>
                                    <span className="text-foreground/90 font-medium">
                                        Fix: {pitfall.fix}
                                    </span>
                                </div>
                                <span className="px-2 py-1 rounded bg-secondary text-muted-foreground text-[10px] font-mono shrink-0">
                                    Unit {currentPhase === 2 ? 'II' : 'I'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Mistakes Review Drawer */}
            <MistakeReviewDrawer
                isOpen={mistakesDrawerOpen}
                onClose={() => setMistakesDrawerOpen(false)}
            />
        </div>
    );
}
