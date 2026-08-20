/**
 * PythonAssessmentPage Component (/python/phase/:phaseId/assessment)
 * Comprehensive Multi-Section Final Assessment for Phase 1 & Phase 2:
 * Section A (Concepts), Section B (Predict Output), Section C (Debugging),
 * Section D (Flowcharts / Logic), Section E (Live Coding Problems).
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileCheck2,
    CheckCircle2,
    XCircle,
    RotateCcw,
    ArrowRight,
    Trophy,
    Sparkles,
    Check,
    Clock,
    Zap,
    HelpCircle,
    Code2,
    Terminal,
    GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PythonHeader } from '../components/PythonHeader';
import { PythonEditor } from '../components/PythonEditor';
import { PHASE_1_ASSESSMENT } from '../data/python-phase1.data';
import { PHASE_2_ASSESSMENT } from '../data/python-phase2.data';
import { usePythonState } from '../hooks/usePythonState';
import { AssessmentQuestion } from '../types/python.types';
import { cn } from '@/lib/utils';

export default function PythonAssessmentPage() {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    const { state, recordAssessmentResult, logMistake } = usePythonState();

    const currentPhase = parseInt(phaseId || '1', 10);
    const assessment = currentPhase === 2 ? PHASE_2_ASSESSMENT : PHASE_1_ASSESSMENT;

    const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');

    // Multiple-choice answers
    const [answers, setAnswers] = useState<Record<string, number>>({});

    // Live coding solutions status
    const [codingResults, setCodingResults] = useState<Record<string, boolean>>({});

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(0);

    const handleSelectOption = (qId: string, optIdx: number) => {
        if (isSubmitted) return;
        setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    };

    const handleCodingSuccess = (qId: string) => {
        setCodingResults((prev) => ({ ...prev, [qId]: true }));
    };

    const handleSubmitAssessment = () => {
        let earnedPoints = 0;
        const sectionScores: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };

        assessment.questions.forEach((q) => {
            if (q.section === 'E' || (currentPhase === 1 && q.section === 'D')) {
                if (codingResults[q.id]) {
                    earnedPoints += q.points;
                    sectionScores[q.section] += q.points;
                }
            } else {
                const userChoice = answers[q.id];
                if (userChoice === q.correctAnswer) {
                    earnedPoints += q.points;
                    sectionScores[q.section] += q.points;
                } else if (q.options && q.correctAnswer !== undefined) {
                    logMistake({
                        sourceType: 'assessment',
                        sourceId: q.id,
                        questionText: q.question,
                        codeSnippet: q.codeSnippet,
                        userAnswer: userChoice !== undefined ? q.options[userChoice] : 'Unanswered',
                        correctAnswer: q.options[q.correctAnswer],
                        explanation: q.explanation || 'Review topic rules.',
                        topic: q.topic,
                    });
                }
            }
        });

        const pct = Math.round((earnedPoints / assessment.totalPoints) * 100);
        const passed = pct >= assessment.passingScorePercent;

        setFinalScore(earnedPoints);
        setPercentage(pct);
        setIsSubmitted(true);

        recordAssessmentResult({
            score: earnedPoints,
            totalPoints: assessment.totalPoints,
            percentage: pct,
            passed,
            sectionScores,
            phaseId: currentPhase,
        });
    };

    const activeQuestions = assessment.questions.filter((q) => q.section === activeSection);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PythonHeader
                title={assessment.title}
                subtitle={`Unit ${currentPhase === 2 ? 'II' : 'I'} Comprehensive Exam`}
                showBack
                backTo={`/python/phase/${currentPhase}`}
            />

            <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8 pb-20">
                {/* Header Banner */}
                <div className="rounded-3xl border border-accent/40 bg-gradient-to-r from-accent/15 via-card to-card/60 p-6 md:p-8 relative overflow-hidden shadow-elevated">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30">
                                {currentPhase === 2 ? "Unit II Final Assessment" : "Phase 1 Final Assessment"}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-display font-black text-foreground">
                                {assessment.title}
                            </h1>
                            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
                                {assessment.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                            <Zap className="h-4 w-4 text-amber-400" />
                            <span>+{assessment.xpReward} XP Reward</span>
                        </div>
                    </div>
                </div>

                {/* Score Banner if Submitted */}
                {isSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            'p-6 md:p-8 rounded-3xl border shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-6',
                            percentage >= assessment.passingScorePercent
                                ? 'bg-emerald-950/20 border-emerald-500/40'
                                : 'bg-rose-950/20 border-rose-500/40'
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    'h-16 w-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0',
                                    percentage >= assessment.passingScorePercent
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                )}
                            >
                                {percentage}%
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-foreground">
                                    {percentage >= assessment.passingScorePercent
                                        ? 'Congratulations! Assessment Passed 🎉'
                                        : 'Score Below Passing Threshold (70%)'}
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    You scored <strong>{finalScore}</strong> out of <strong>{assessment.totalPoints}</strong> points.
                                    {percentage >= assessment.passingScorePercent
                                        ? ' You demonstrated solid mastery of Unit concepts.'
                                        : ' Review missed topics and try again to improve mastery.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setAnswers({});
                                    setCodingResults({});
                                }}
                                className="text-xs h-9"
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Retake Exam
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => navigate(`/python/phase/${currentPhase}`)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 px-4"
                            >
                                Return to Phase Hub
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Section Navigation Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/40">
                    {assessment.sections.map((sec) => {
                        const isCurrent = activeSection === sec.id;
                        return (
                            <button
                                key={sec.id}
                                onClick={() => setActiveSection(sec.id)}
                                className={cn(
                                    'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border',
                                    isCurrent
                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                        : 'bg-secondary/40 text-muted-foreground hover:bg-secondary border-border/40'
                                )}
                            >
                                <span>{sec.title}</span>
                                <span className={cn('px-1.5 py-0.2 rounded text-[10px] font-mono', isCurrent ? 'bg-primary-foreground/20 text-white' : 'bg-secondary text-muted-foreground')}>
                                    {sec.questionCount}Q
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Questions Arena */}
                <div className="space-y-6">
                    {activeQuestions.map((q, idx) => {
                        const isCoding = q.section === 'E' || (currentPhase === 1 && q.section === 'D');
                        const userChoice = answers[q.id];
                        const isCorrect = userChoice === q.correctAnswer;
                        const isPassedCoding = codingResults[q.id];

                        return (
                            <div
                                key={q.id}
                                className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md space-y-4 shadow-sm"
                            >
                                {/* Question Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/15 text-primary">
                                                Question {idx + 1}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                {q.points} Points • {q.topic}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-bold text-foreground">
                                            {q.question}
                                        </h3>
                                    </div>

                                    {isSubmitted && !isCoding && (
                                        <div className="shrink-0">
                                            {isCorrect ? (
                                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                                                    <Check className="h-3.5 w-3.5" /> Correct (+{q.points})
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/30 border border-rose-500/30 px-2.5 py-1 rounded-full">
                                                    <XCircle className="h-3.5 w-3.5" /> Incorrect (0/{q.points})
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Code Snippet if applicable */}
                                {q.codeSnippet && (
                                    <pre className="p-3.5 rounded-xl bg-[#0d1117] border border-border/40 font-mono text-xs text-emerald-300 overflow-x-auto">
                                        {q.codeSnippet}
                                    </pre>
                                )}

                                {/* Flowchart ASCII diagram if applicable */}
                                {q.flowchartAscii && (
                                    <div className="p-4 rounded-xl bg-[#0d1117] border border-border/40 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed">
                                        {q.flowchartAscii}
                                    </div>
                                )}

                                {/* Multiple Choice Options */}
                                {!isCoding && q.options && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                        {q.options.map((opt, optIdx) => {
                                            const isSelected = userChoice === optIdx;
                                            let optStyle = 'border-border/40 hover:bg-secondary/40 bg-secondary/15';

                                            if (isSubmitted) {
                                                if (optIdx === q.correctAnswer) {
                                                    optStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-300 font-semibold';
                                                } else if (isSelected && !isCorrect) {
                                                    optStyle = 'border-rose-500 bg-rose-950/30 text-rose-300 line-through';
                                                }
                                            } else if (isSelected) {
                                                optStyle = 'border-primary bg-primary/15 text-primary font-semibold';
                                            }

                                            return (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => handleSelectOption(q.id, optIdx)}
                                                    className={cn(
                                                        'p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between',
                                                        optStyle
                                                    )}
                                                >
                                                    <span>{opt}</span>
                                                    {isSubmitted && optIdx === q.correctAnswer && (
                                                        <Check className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Live Coding Problem */}
                                {isCoding && (
                                    <div className="pt-2 space-y-3">
                                        <PythonEditor
                                            initialCode={q.starterCode || ''}
                                            starterCode={q.starterCode || ''}
                                            testCases={q.testCases || []}
                                            onSuccess={() => handleCodingSuccess(q.id)}
                                            submitButtonLabel="Verify Coding Solution"
                                        />
                                        {isPassedCoding && (
                                            <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>Test Passed (+{q.points} Points)</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Explanation on submission */}
                                {isSubmitted && !isCoding && q.explanation && (
                                    <div
                                        className={cn(
                                            'p-3.5 rounded-xl text-xs leading-relaxed border',
                                            isCorrect
                                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                                : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                                        )}
                                    >
                                        <strong>{isCorrect ? 'Correct! ' : 'Explanation: '}</strong>
                                        {q.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Submit Sticky Bar */}
                {!isSubmitted && (
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-xl w-[90%] p-4 rounded-2xl bg-card border border-border/80 shadow-2xl backdrop-blur-md flex items-center justify-between z-40">
                        <div className="text-xs text-muted-foreground">
                            <span>Ready to grade your exam?</span>
                        </div>

                        <Button
                            onClick={handleSubmitAssessment}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs px-6 h-9 shadow-sm glow-warm"
                        >
                            Submit Final Assessment
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
