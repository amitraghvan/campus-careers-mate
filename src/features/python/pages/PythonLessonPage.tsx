/**
 * PythonLessonPage Component (/python/phase/1/chapter/:chapterId/lesson/:lessonId)
 * Complete interactive Duolingo-style lesson experience:
 * Learn -> Why It Matters -> Syntax -> Example -> Try It Yourself -> Quick Check -> Mini Challenge -> Lesson Complete.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Lightbulb,
    HelpCircle,
    Zap,
    Play,
    RotateCcw,
    Check,
    AlertCircle,
    Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PythonHeader } from '../components/PythonHeader';
import { PythonEditor } from '../components/PythonEditor';
import { VisualDiagramViewer } from '../components/VisualDiagramViewer';
import { BadgeCelebrationModal } from '../components/BadgeCelebrationModal';
import { PHASE_1_CHAPTERS } from '../data/python-phase1.data';
import { PHASE_2_CHAPTERS } from '../data/python-phase2.data';
import { usePythonState } from '../hooks/usePythonState';
import { PythonBadge } from '../types/python.types';
import { cn } from '@/lib/utils';

const ALL_CHAPTERS = [...PHASE_1_CHAPTERS, ...PHASE_2_CHAPTERS];

export default function PythonLessonPage() {
    const { phaseId, chapterId, lessonId } = useParams();
    const navigate = useNavigate();
    const { state, completeLesson, logMistake, badges } = usePythonState();

    const cId = parseInt(chapterId || '1', 10);
    const chapter = ALL_CHAPTERS.find((c) => c.id === cId) || ALL_CHAPTERS[0];
    const lessonIndex = chapter.lessons.findIndex((l) => l.id === lessonId);
    const lesson = chapter.lessons[lessonIndex !== -1 ? lessonIndex : 0];
    const currentPhase = chapter.id <= 3 ? 1 : 2;

    // Quick Check State
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [quickCheckSubmitted, setQuickCheckSubmitted] = useState(false);

    // Mini Challenge State
    const [miniChallengePassed, setMiniChallengePassed] = useState(false);

    // Completion / Badge modal state
    const [isCompletedNow, setIsCompletedNow] = useState(false);
    const [unlockedBadge, setUnlockedBadge] = useState<PythonBadge | null>(null);

    const isAlreadyCompleted = state.completedLessons.includes(lesson.id);

    useEffect(() => {
        // Reset interactive state on lesson change
        setSelectedAnswers({});
        setQuickCheckSubmitted(false);
        setMiniChallengePassed(false);
        setIsCompletedNow(false);
    }, [lesson.id]);

    const handleSelectOption = (qIdx: number, optIdx: number) => {
        if (quickCheckSubmitted) return;
        setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    };

    const handleCheckQuizAnswers = () => {
        setQuickCheckSubmitted(true);

        // Check if all correct and log mistakes
        lesson.quickCheck.forEach((q, idx) => {
            const userAns = selectedAnswers[idx];
            if (userAns !== q.correctAnswer) {
                logMistake({
                    sourceType: 'lesson_quick_check',
                    sourceId: `${lesson.id}-qc-${idx}`,
                    questionText: q.question,
                    userAnswer: q.options[userAns] || 'Unanswered',
                    correctAnswer: q.options[q.correctAnswer],
                    explanation: q.explanation,
                    topic: lesson.topics[0] || 'Fundamentals',
                });
            }
        });
    };

    const handleMiniChallengeSuccess = () => {
        setMiniChallengePassed(true);
        handleFinishLesson();
    };

    const handleFinishLesson = () => {
        setIsCompletedNow(true);
        completeLesson(lesson.id, chapter.id, lesson.xpReward);

        // Check newly unlocked badge to celebrate
        if (lesson.id === 'p1-c1-l1' && !state.unlockedBadges.includes('FIRST_STEP')) {
            const b = badges.find((x) => x.id === 'FIRST_STEP');
            if (b) setUnlockedBadge(b);
        } else if (lesson.id === 'p1-c1-l10' && !state.unlockedBadges.includes('HELLO_WORLD')) {
            const b = badges.find((x) => x.id === 'HELLO_WORLD');
            if (b) setUnlockedBadge(b);
        }
    };

    const nextLesson = chapter.lessons[lessonIndex + 1];

    const handleContinueNext = () => {
        if (nextLesson) {
            navigate(`/python/phase/${currentPhase}/chapter/${chapter.id}/lesson/${nextLesson.id}`);
        } else {
            navigate(`/python/phase/${currentPhase}/chapter/${chapter.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PythonHeader
                title={`Lesson ${lesson.lessonNumber}: ${lesson.title}`}
                subtitle={`Chapter ${chapter.chapterNumber}: ${chapter.title}`}
                showBack
                backTo={`/python/phase/${currentPhase}/chapter/${chapter.id}`}
            />

            <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8 pb-16">
                {/* 1. Lesson Title & Intro */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
                            Lesson {lesson.lessonNumber} of {chapter.lessons.length}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            +{lesson.xpReward} XP Reward
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-black text-foreground">
                        {lesson.title}
                    </h1>

                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {lesson.description}
                    </p>
                </div>

                {/* 2. What You'll Learn */}
                <div className="p-5 rounded-2xl border border-border/50 bg-secondary/20 space-y-3">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        What You'll Master
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90 font-medium">
                        {lesson.whatYoullLearn.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3. Concept */}
                <div className="space-y-3">
                    <h2 className="text-lg md:text-xl font-display font-bold text-foreground flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        The Core Concept
                    </h2>
                    <div className="text-sm text-foreground/90 leading-relaxed font-sans p-5 rounded-2xl bg-card/60 border border-border/40 space-y-3">
                        <p>{lesson.concept}</p>
                    </div>
                </div>

                {/* 4. Visual Educational Diagram / Flowchart */}
                {lesson.visualDiagram && (
                    <div className="space-y-2">
                        <VisualDiagramViewer diagram={lesson.visualDiagram} />
                    </div>
                )}

                {/* 5. Why It Matters */}
                <div className="p-5 rounded-2xl border border-accent/30 bg-accent/10 space-y-2">
                    <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Why This Matters in the Real World
                    </h3>
                    <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                        {lesson.whyItMatters}
                    </p>
                </div>

                {/* 6. Syntax & Code Example */}
                <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-display font-bold text-foreground">
                        Syntax & Code Example
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Syntax Card */}
                        <div className="p-4 rounded-2xl bg-[#0d1117] border border-border/50 font-mono text-xs space-y-2">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block border-b border-border/30 pb-1.5">
                                General Syntax
                            </span>
                            <pre className="text-emerald-300 whitespace-pre-wrap leading-5">
                                {lesson.syntax}
                            </pre>
                        </div>

                        {/* Example Card */}
                        <div className="p-4 rounded-2xl bg-[#0d1117] border border-border/50 font-mono text-xs space-y-2">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block border-b border-border/30 pb-1.5">
                                Working Example
                            </span>
                            <pre className="text-cyan-300 whitespace-pre-wrap leading-5">
                                {lesson.exampleCode}
                            </pre>
                            <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground">
                                <span className="block font-semibold text-foreground/80">Expected Output:</span>
                                <pre className="text-emerald-400 mt-1 whitespace-pre-wrap">
                                    {lesson.expectedOutput}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Step-by-Step Line Explanation if present */}
                    {lesson.stepByStepExplanation && lesson.stepByStepExplanation.length > 0 && (
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-2 text-xs">
                            <span className="font-bold text-primary block uppercase tracking-wider text-[11px]">
                                Line-by-Line Execution Breakdown:
                            </span>
                            <ul className="space-y-1.5 text-foreground/90 font-mono">
                                {lesson.stepByStepExplanation.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-primary font-bold">↳</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* 7. Try It Yourself (Interactive Editor) */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg md:text-xl font-display font-bold text-foreground">
                                Try It Yourself
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Edit the code below and press "Run Code" to experiment with the interpreter in real-time.
                            </p>
                        </div>
                    </div>

                    <PythonEditor
                        initialCode={lesson.interactiveStarterCode}
                        starterCode={lesson.interactiveStarterCode}
                        hideSubmit
                    />
                </div>

                {/* 8. Quick Check */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                    <div>
                        <h2 className="text-lg md:text-xl font-display font-bold text-foreground flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-amber-400" />
                            Quick Knowledge Check
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Verify your understanding with these conceptual checks.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {lesson.quickCheck.map((qc, qIdx) => {
                            const userChoice = selectedAnswers[qIdx];
                            const isAnswered = userChoice !== undefined;
                            const isCorrect = userChoice === qc.correctAnswer;

                            return (
                                <div
                                    key={qIdx}
                                    className="p-5 rounded-2xl border border-border/50 bg-card/60 space-y-3"
                                >
                                    <h4 className="text-sm font-bold text-foreground">
                                        {qIdx + 1}. {qc.question}
                                    </h4>

                                    <div className="space-y-2">
                                        {qc.options.map((opt, optIdx) => {
                                            const isSelected = userChoice === optIdx;
                                            let optionClass = 'border-border/40 hover:bg-secondary/50 bg-secondary/20';

                                            if (quickCheckSubmitted) {
                                                if (optIdx === qc.correctAnswer) {
                                                    optionClass = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-semibold';
                                                } else if (isSelected && !isCorrect) {
                                                    optionClass = 'border-rose-500/50 bg-rose-950/20 text-rose-300 line-through';
                                                }
                                            } else if (isSelected) {
                                                optionClass = 'border-primary bg-primary/10 text-primary font-semibold';
                                            }

                                            return (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => handleSelectOption(qIdx, optIdx)}
                                                    className={cn(
                                                        'w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between',
                                                        optionClass
                                                    )}
                                                >
                                                    <span>{opt}</span>
                                                    {quickCheckSubmitted && optIdx === qc.correctAnswer && (
                                                        <Check className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {quickCheckSubmitted && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={cn(
                                                'p-3 rounded-xl text-xs leading-relaxed border',
                                                isCorrect
                                                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                                            )}
                                        >
                                            <strong>{isCorrect ? 'Correct! ' : 'Explanation: '}</strong>
                                            {qc.explanation}
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}

                        {!quickCheckSubmitted ? (
                            <Button
                                onClick={handleCheckQuizAnswers}
                                disabled={Object.keys(selectedAnswers).length < lesson.quickCheck.length}
                                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-5 h-9"
                            >
                                Check Answers
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <span>Quick Check completed. Proceed to the Mini Challenge below.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 9. Mini Challenge */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30">
                                Hands-on Task
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Test automated test suite
                            </span>
                        </div>
                        <h2 className="text-lg md:text-xl font-display font-bold text-foreground mt-1">
                            Mini Challenge: {lesson.miniChallenge.title}
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                            {lesson.miniChallenge.instruction}
                        </p>
                    </div>

                    <PythonEditor
                        initialCode={lesson.miniChallenge.starterCode}
                        starterCode={lesson.miniChallenge.starterCode}
                        testCases={lesson.miniChallenge.testCases}
                        onSubmitSuccess={handleMiniChallengeSuccess}
                        submitButtonText="Run & Complete Lesson"
                    />
                </div>

                {/* 10. Lesson Complete Card */}
                {(isAlreadyCompleted || miniChallengePassed || isCompletedNow) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-card to-card/90 shadow-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xl">
                                <Trophy className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-display font-bold text-foreground">
                                    Lesson {lesson.lessonNumber} Completed! 🎉
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    +{lesson.xpReward} XP awarded to your profile. Ready for the next challenge!
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={handleContinueNext}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 h-10 glow-primary shrink-0"
                        >
                            <span>{nextLesson ? 'Continue to Next Lesson' : 'Back to Chapter Hub'}</span>
                            <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Button>
                    </motion.div>
                )}
            </main>

            {/* Badge Celebration Pop-up */}
            <BadgeCelebrationModal
                badge={unlockedBadge}
                onClose={() => setUnlockedBadge(null)}
            />
        </div>
    );
}
