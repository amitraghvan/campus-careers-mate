/**
 * PythonExamModePage Component (/python/phase/:phaseId/exam-mode)
 * University & Placement-aligned Exam Mode Revision for Unit I and Unit II.
 * Provides rapid-fire output prediction drills, definitions, and debugging practice.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileCheck2,
    CheckCircle2,
    XCircle,
    RotateCcw,
    BookOpen,
    Zap,
    Check,
    HelpCircle,
    Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PythonHeader } from '../components/PythonHeader';
import { usePythonState } from '../hooks/usePythonState';
import { cn } from '@/lib/utils';

const UNIT_1_RAPID_FIRE = [
    {
        id: 'rf1-1',
        title: 'Floor Division Check',
        question: 'What is the output of `print(19 // 5)`?',
        code: 'print(19 // 5)',
        options: ['3.8', '3', '4', '19'],
        correctAnswer: 1,
        explanation: 'Floor division rounds down to the nearest whole integer: 19 // 5 = 3.',
    },
    {
        id: 'rf1-2',
        title: 'String Repetition',
        question: 'What is the output of `print("7" * 3)`?',
        code: 'print("7" * 3)',
        options: ['21', '"777"', 'Error', '"7 3"'],
        correctAnswer: 1,
        explanation: 'String multiplied by integer repeats text: "777".',
    },
    {
        id: 'rf1-3',
        title: 'Precedence Order',
        question: 'What is the output of `print(2 + 4 * 3 ** 2)`?',
        code: 'print(2 + 4 * 3 ** 2)',
        options: ['38', '54', '146', '36'],
        correctAnswer: 0,
        explanation: '3 ** 2 = 9; 4 * 9 = 36; 2 + 36 = 38.',
    },
    {
        id: 'rf1-4',
        title: 'Boolean Expression',
        question: 'What is printed by `print(not (10 == 10 and 5 > 2))`?',
        code: 'print(not (10 == 10 and 5 > 2))',
        options: ['True', 'False', 'None', 'Error'],
        correctAnswer: 1,
        explanation: '10 == 10 is True, 5 > 2 is True -> True and True is True. not True is False.',
    },
    {
        id: 'rf1-5',
        title: 'Variable Swap',
        question: 'Given `x, y = 10, 20; x, y = y, x`, what is `x`?',
        code: 'x, y = 10, 20\nx, y = y, x\nprint(x)',
        options: ['10', '20', '30', 'Error'],
        correctAnswer: 1,
        explanation: 'Tuple swap assigns y (20) to x.',
    },
];

const UNIT_2_RAPID_FIRE = [
    {
        id: 'rf2-1',
        title: 'Modulus Divisibility',
        question: 'What is the output of `print(17 % 5)`?',
        code: 'print(17 % 5)',
        options: ['3.4', '2', '3', '0'],
        correctAnswer: 1,
        explanation: '5 * 3 = 15; 17 - 15 = 2. Remainder is 2.',
    },
    {
        id: 'rf2-2',
        title: 'range() Stop Bound',
        question: 'What is printed by `for i in range(1, 4): print(i)`?',
        code: 'for i in range(1, 4):\n    print(i)',
        options: ['1, 2, 3, 4', '1, 2, 3', '0, 1, 2, 3', '4'],
        correctAnswer: 1,
        explanation: 'range(1, 4) stops before 4, generating 1, 2, 3.',
    },
    {
        id: 'rf2-3',
        title: 'while Loop Termination',
        question: 'What is printed by `x = 3; while x > 0: x -= 1; print(x)`?',
        code: 'x = 3\nwhile x > 0:\n    x -= 1\nprint(x)',
        options: ['0', '1', '-1', '3'],
        correctAnswer: 0,
        explanation: 'x decrements to 2, 1, and finally 0. When x=0, 0 > 0 is False, ending the loop with x=0.',
    },
    {
        id: 'rf2-4',
        title: 'Accumulator Total',
        question: 'What is the final value of `total`?\ntotal = 0\nfor i in range(1, 4):\n    total += i',
        code: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
        options: ['6', '4', '10', '3'],
        correctAnswer: 0,
        explanation: '1 + 2 + 3 = 6.',
    },
    {
        id: 'rf2-5',
        title: 'Nested Loop Passes',
        question: 'How many total times does `print("A")` run?\nfor i in range(3):\n    for j in range(2):\n        print("A")',
        code: 'for i in range(3):\n    for j in range(2):\n        print("A")',
        options: ['5', '6', '3', '2'],
        correctAnswer: 1,
        explanation: '3 outer passes × 2 inner passes = 6 total executions.',
    },
];

export default function PythonExamModePage() {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    const { state } = usePythonState();

    const currentPhase = parseInt(phaseId || '1', 10);
    const questions = currentPhase === 2 ? UNIT_2_RAPID_FIRE : UNIT_1_RAPID_FIRE;

    const [userChoices, setUserChoices] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSelect = (qId: string, optIdx: number) => {
        if (submitted) return;
        setUserChoices((prev) => ({ ...prev, [qId]: optIdx }));
    };

    const handleEvaluate = () => {
        let count = 0;
        questions.forEach((q) => {
            if (userChoices[q.id] === q.correctAnswer) count++;
        });
        setScore(count);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PythonHeader
                title={`Unit ${currentPhase === 2 ? 'II' : 'I'} Exam Mode Revision`}
                subtitle="High-yield placement and university exam practice"
                showBack
                backTo={`/python/phase/${currentPhase}`}
            />

            <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8 pb-16">
                {/* Mode Alert Header */}
                <div className="rounded-3xl border border-accent/40 bg-gradient-to-r from-accent/15 via-card to-card/60 p-6 md:p-8 relative overflow-hidden shadow-elevated">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30">
                                Exam Mode Active
                            </span>
                            <h1 className="text-2xl md:text-3xl font-display font-black text-foreground">
                                Rapid-Fire Output Predictions & Theory
                            </h1>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                Sharpen your accuracy for semester exams and technical placement rounds.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/python/phase/${currentPhase}`)}
                            className="text-xs h-9 shrink-0"
                        >
                            Switch to Learn Mode
                        </Button>
                    </div>
                </div>

                {/* Score Banner if submitted */}
                {submitted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl border border-accent/40 bg-accent/10 flex items-center justify-between shadow-elevated"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="h-12 w-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-bold text-xl">
                                <FileCheck2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-foreground">
                                    Exam Drill Completed: {score}/{questions.length} Correct
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {score === questions.length
                                        ? `Perfect score! You are fully prepared for Unit ${currentPhase === 2 ? 'II' : 'I'}.`
                                        : 'Review the explanations below for missed questions.'}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSubmitted(false);
                                setUserChoices({});
                            }}
                            className="text-xs h-9"
                        >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Retry Drill
                        </Button>
                    </motion.div>
                )}

                {/* Rapid Fire Drills */}
                <div className="space-y-6">
                    <h2 className="text-lg md:text-xl font-display font-bold text-foreground">
                        Rapid-Fire Questions
                    </h2>

                    {questions.map((q, idx) => {
                        const userChoice = userChoices[q.id];
                        const isCorrect = userChoice === q.correctAnswer;

                        return (
                            <div
                                key={q.id}
                                className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md space-y-4 shadow-sm"
                            >
                                <div>
                                    <span className="text-xs font-bold text-accent uppercase tracking-wider">
                                        Question {idx + 1}
                                    </span>
                                    <h3 className="text-base font-bold text-foreground mt-0.5">
                                        {q.question}
                                    </h3>
                                </div>

                                {q.code && (
                                    <pre className="p-3 rounded-xl bg-[#0d1117] border border-border/40 font-mono text-xs text-emerald-300 overflow-auto">
                                        {q.code}
                                    </pre>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {q.options.map((opt, optIdx) => {
                                        const isSelected = userChoice === optIdx;
                                        let optStyle = 'border-border/40 hover:bg-secondary/40 bg-secondary/15';

                                        if (submitted) {
                                            if (optIdx === q.correctAnswer) {
                                                optStyle = 'border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold';
                                            } else if (isSelected && !isCorrect) {
                                                optStyle = 'border-rose-500 bg-rose-950/20 text-rose-300 line-through';
                                            }
                                        } else if (isSelected) {
                                            optStyle = 'border-accent bg-accent/15 text-accent font-semibold';
                                        }

                                        return (
                                            <button
                                                key={optIdx}
                                                onClick={() => handleSelect(q.id, optIdx)}
                                                className={cn(
                                                    'p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between',
                                                    optStyle
                                                )}
                                            >
                                                <span>{opt}</span>
                                                {submitted && optIdx === q.correctAnswer && (
                                                    <Check className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {submitted && (
                                    <div
                                        className={cn(
                                            'p-3 rounded-xl text-xs leading-relaxed border',
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

                {!submitted && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/60 sticky bottom-4 shadow-2xl backdrop-blur-md">
                        <span className="text-xs text-muted-foreground">
                            {Object.keys(userChoices).length} of {questions.length} Answered
                        </span>

                        <Button
                            onClick={handleEvaluate}
                            disabled={Object.keys(userChoices).length < questions.length}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs px-6 h-9"
                        >
                            Check Exam Drill Answers
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
