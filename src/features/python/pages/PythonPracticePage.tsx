/**
 * PythonPracticePage Component (/python/phase/:phaseId/chapter/:chapterId/practice)
 * LeetCode-style Practice Arena for Chapter Coding Challenges.
 * Supports Phase 1 and Phase 2 chapters.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Code2,
    CheckCircle2,
    Circle,
    ArrowRight,
    Sparkles,
    Trophy,
    Zap,
    RotateCcw,
    Layers,
    Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PythonHeader } from '../components/PythonHeader';
import { PythonEditor } from '../components/PythonEditor';
import { AIHintSystem } from '../components/AIHintSystem';
import { PHASE_1_CHAPTERS } from '../data/python-phase1.data';
import { PHASE_2_CHAPTERS } from '../data/python-phase2.data';
import { usePythonState } from '../hooks/usePythonState';
import { cn } from '@/lib/utils';

const ALL_CHAPTERS = [...PHASE_1_CHAPTERS, ...PHASE_2_CHAPTERS];

export default function PythonPracticePage() {
    const { phaseId, chapterId } = useParams();
    const navigate = useNavigate();
    const { state, completeChallenge, recordHintUsage } = usePythonState();

    const cId = parseInt(chapterId || '1', 10);
    const chapter = ALL_CHAPTERS.find((c) => c.id === cId) || ALL_CHAPTERS[0];
    const currentPhase = chapter.id <= 3 ? 1 : 2;

    const [selectedIdx, setSelectedIdx] = useState(0);
    const currentChallenge = chapter.challenges[selectedIdx] || chapter.challenges[0];

    const isSolved = state.completedChallenges.includes(currentChallenge.id);

    const handleChallengeSuccess = (code: string) => {
        completeChallenge(
            currentChallenge.id,
            chapter.id,
            currentChallenge.difficulty,
            currentChallenge.topicCategory,
            code
        );
    };

    const handleHintLevelRevealed = (level: number) => {
        recordHintUsage(currentChallenge.id, level);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PythonHeader
                title={`Practice Arena: Chapter ${chapter.chapterNumber}`}
                subtitle={chapter.title}
                showBack
                backTo={`/python/phase/${currentPhase}/chapter/${chapter.id}`}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
                {/* Challenge Navigation Bar */}
                <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4 overflow-x-auto">
                    <div className="flex items-center gap-2">
                        {chapter.challenges.map((ch, idx) => {
                            const isCurrent = idx === selectedIdx;
                            const isDone = state.completedChallenges.includes(ch.id);

                            return (
                                <button
                                    key={ch.id}
                                    onClick={() => setSelectedIdx(idx)}
                                    className={cn(
                                        'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 border',
                                        isCurrent
                                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                            : 'bg-card text-muted-foreground hover:text-foreground border-border/40 hover:bg-secondary/40'
                                    )}
                                >
                                    <span>#{ch.challengeNumber}</span>
                                    <span className="hidden sm:inline font-mono">{ch.title}</span>
                                    {isDone && (
                                        <CheckCircle2 className={cn('h-3.5 w-3.5', isCurrent ? 'text-white' : 'text-emerald-400')} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground font-mono">
                            {state.completedChallenges.filter((c) => chapter.challenges.some((x) => x.id === c)).length} / {chapter.challenges.length} Solved
                        </span>
                    </div>
                </div>

                {/* Main 2-Panel Challenge Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Problem Description & Instructions (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Title Card */}
                        <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                                    Challenge {currentChallenge.challengeNumber} of {chapter.challenges.length}
                                </span>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'px-2 py-0.5 rounded text-[11px] font-bold uppercase',
                                            currentChallenge.difficulty === 'Easy' && 'bg-emerald-500/15 text-emerald-400',
                                            currentChallenge.difficulty === 'Medium' && 'bg-amber-500/15 text-amber-400',
                                            currentChallenge.difficulty === 'Hard' && 'bg-rose-500/15 text-rose-400'
                                        )}
                                    >
                                        {currentChallenge.difficulty}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-amber-300">
                                        +{currentChallenge.xpReward} XP
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                                {currentChallenge.title}
                            </h1>

                            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                {currentChallenge.description}
                            </p>

                            {isSolved && (
                                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Challenge Solved! You earned +{currentChallenge.xpReward} XP.</span>
                                </div>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md space-y-3">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Implementation Instructions
                            </h3>
                            <ul className="space-y-2 text-xs text-foreground/90 font-medium">
                                {currentChallenge.instructions.map((inst, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        <span>{inst}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Test Cases Overview */}
                        <div className="p-4 rounded-2xl bg-[#0d1117] border border-border/50 font-mono text-xs space-y-2">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block border-b border-border/30 pb-1.5">
                                Target Output Specification
                            </span>
                            <pre className="text-emerald-300 whitespace-pre-wrap leading-5">
                                {currentChallenge.testCases[0]?.expectedOutput || '[Random Match Target]'}
                            </pre>
                        </div>

                        {/* AI Progressive Hint System */}
                        <AIHintSystem
                            hints={currentChallenge.hints}
                            solutionCode={currentChallenge.solutionCode}
                            solutionExplanation={currentChallenge.solutionExplanation}
                            entityId={currentChallenge.id}
                            onRevealHint={handleHintLevelRevealed}
                        />
                    </div>

                    {/* Right: Code Editor & Console Arena (7 Cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        <PythonEditor
                            initialCode={
                                state.codeSubmissions[currentChallenge.id] ||
                                currentChallenge.starterCode
                            }
                            starterCode={currentChallenge.starterCode}
                            testCases={currentChallenge.testCases}
                            onSuccess={handleChallengeSuccess}
                            submitButtonLabel="Run & Submit Code"
                        />

                        {/* Navigation Footer */}
                        <div className="flex items-center justify-between pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={selectedIdx === 0}
                                onClick={() => setSelectedIdx((prev) => Math.max(0, prev - 1))}
                                className="text-xs h-8"
                            >
                                Previous Challenge
                            </Button>

                            <Button
                                size="sm"
                                disabled={selectedIdx >= chapter.challenges.length - 1}
                                onClick={() => setSelectedIdx((prev) => Math.min(chapter.challenges.length - 1, prev + 1))}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-8"
                            >
                                <span>Next Challenge</span>
                                <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
