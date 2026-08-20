/**
 * PythonQuizPage Component (/python/phase/:phaseId/chapter/:chapterId/quiz)
 * Interactive Chapter Quiz with prediction, error identification,
 * immediate feedback, passing threshold (>=70%), and XP awards.
 * Supports Phase 1 and Phase 2 chapters.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileQuestion,
    CheckCircle2,
    XCircle,
    RotateCcw,
    ArrowRight,
    Trophy,
    Sparkles,
    Check,
    AlertCircle,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PythonHeader } from '../components/PythonHeader';
import { PHASE_1_CHAPTERS } from '../data/python-phase1.data';
import { PHASE_2_CHAPTERS } from '../data/python-phase2.data';
import { usePythonState } from '../hooks/usePythonState';
import { cn } from '@/lib/utils';

const ALL_CHAPTERS = [...PHASE_1_CHAPTERS, ...PHASE_2_CHAPTERS];

export default function PythonQuizPage() {
    const { phaseId, chapterId } = useParams();
    const navigate = useNavigate();
    const { state, recordQuizScore, logMistake } = usePythonState();

    const cId = parseInt(chapterId || '1', 10);
    const chapter = ALL_CHAPTERS.find((c) => c.id === cId) || ALL_CHAPTERS[0];
    const currentPhase = chapter.id <= 3 ? 1 : 2;
    const quiz = chapter.quiz;

    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [scorePct, setScorePct] = useState(0);

    const handleSelectOption = (qIdx: number, optIdx: number) => {
        if (isSubmitted) return;
        setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    };

    const handleSubmitQuiz = () => {
        let correctCount = 0;
        quiz.questions.forEach((q, idx) => {
            const userChoice = userAnswers[idx];
            if (userChoice === q.correctAnswer) {
                correctCount++;
            } else {
                logMistake({
                    sourceType: 'quiz',
                    sourceId: `${chapter.id}-q-${idx}`,
                    questionText: q.question,
                    codeSnippet: q.codeSnippet,
                    userAnswer: userChoice !== undefined ? q.options[userChoice] : 'Unanswered',
                    correctAnswer: q.options[q.correctAnswer],
                    explanation: q.explanation,
                    topic: q.topic,
                });
            }
        });

        const calculatedScorePct = Math.round((correctCount / quiz.questions.length) * 100);
        const passed = calculatedScorePct >= quiz.passingScorePercent;

        setScorePct(calculatedScorePct);
        setIsSubmitted(true);

        recordQuizScore(chapter.id, calculatedScorePct, passed);
    };

    const isPassed = scorePct >= quiz.passingScorePercent;
    const answeredCount = Object.keys(userAnswers).length;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PythonHeader
                title={`Chapter ${chapter.chapterNumber} Quiz`}
                subtitle={quiz.title}
                showBack
                backTo={`/python/phase/${currentPhase}/chapter/${chapter.id}`}
            />

            <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8 pb-20">
                {/* Hero Header */}
                <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-card/60 p-6 md:p-8 relative overflow-hidden shadow-elevated">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                                Chapter {chapter.chapterNumber} Knowledge Gate
                            </span>
                            <h1 className="text-2xl md:text-3xl font-display font-black text-foreground">
                                {quiz.title}
                            </h1>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Score at least <strong>{quiz.passingScorePercent}%</strong> to earn +{quiz.xpReward} XP.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                            <Zap className="h-4 w-4 text-amber-400" />
                            <span>+{quiz.xpReward} XP Reward</span>
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
                            isPassed
                                ? 'bg-emerald-950/20 border-emerald-500/40'
                                : 'bg-rose-950/20 border-rose-500/40'
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    'h-16 w-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0',
                                    isPassed
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                )}
                            >
                                {scorePct}%
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-foreground">
                                    {isPassed
                                        ? 'Quiz Passed! Chapter Milestone Complete 🎉'
                                        : 'Score Below Passing Threshold'}
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {isPassed
                                        ? `You earned the +${quiz.xpReward} XP reward.`
                                        : 'Review the explanations below and retake the quiz to improve your score.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setUserAnswers({});
                                }}
                                className="text-xs h-9"
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Retake Quiz
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => navigate(`/python/phase/${currentPhase}/chapter/${chapter.id}`)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 px-4"
                            >
                                Return to Chapter
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Questions List */}
                <div className="space-y-6">
                    {quiz.questions.map((q, idx) => {
                        const userChoice = userAnswers[idx];
                        const isCorrect = userChoice === q.correctAnswer;

                        return (
                            <div
                                key={q.id}
                                className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md space-y-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                            Question {idx + 1} of {quiz.questions.length}
                                        </span>
                                        <h3 className="text-base font-bold text-foreground">
                                            {q.question}
                                        </h3>
                                    </div>

                                    {isSubmitted && (
                                        <div className="shrink-0">
                                            {isCorrect ? (
                                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                                                    <Check className="h-3.5 w-3.5" /> Correct
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/30 border border-rose-500/30 px-2.5 py-1 rounded-full">
                                                    <XCircle className="h-3.5 w-3.5" /> Incorrect
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {q.codeSnippet && (
                                    <pre className="p-3.5 rounded-xl bg-[#0d1117] border border-border/40 font-mono text-xs text-emerald-300 overflow-x-auto">
                                        {q.codeSnippet}
                                    </pre>
                                )}

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
                                                onClick={() => handleSelectOption(idx, optIdx)}
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

                                {isSubmitted && (
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
                            <span>
                                <strong>{answeredCount}</strong> of <strong>{quiz.questions.length}</strong> Answered
                            </span>
                        </div>

                        <Button
                            onClick={handleSubmitQuiz}
                            disabled={answeredCount < quiz.questions.length}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-6 h-9 shadow-sm glow-primary"
                        >
                            Submit Quiz
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
