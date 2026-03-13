/**
 * HomeworkSolverPage — AI-powered step-by-step homework solver.
 * Supports math, science, coding and any academic question.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Sparkles,
    Send,
    Loader2,
    MessageSquare,
    ChevronDown,
    Copy,
    CheckCheck,
    Lightbulb,
    Code2,
    FlaskConical,
    Calculator,
    RotateCcw,
} from 'lucide-react';
import { homeworkService } from '@/services/homework.service';

interface FollowUpMsg {
    role: 'user' | 'assistant';
    text: string;
}

const EXAMPLE_QUESTIONS = [
    { label: 'Math', icon: Calculator, q: 'Solve the equation: 2x² + 5x - 3 = 0' },
    { label: 'Science', icon: FlaskConical, q: 'Explain Newton\'s three laws of motion with examples.' },
    { label: 'Coding', icon: Code2, q: 'Write a Python function to find all prime numbers up to N using the Sieve of Eratosthenes.' },
    { label: 'Concept', icon: Lightbulb, q: 'Explain the difference between stack and heap memory in programming.' },
];

export default function HomeworkSolverPage() {
    const [question, setQuestion] = useState('');
    const [solution, setSolution] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Follow-up chat
    const [followUps, setFollowUps] = useState<FollowUpMsg[]>([]);
    const [followInput, setFollowInput] = useState('');
    const [followLoading, setFollowLoading] = useState(false);
    const [showFollowUp, setShowFollowUp] = useState(false);

    // Copy state
    const [copied, setCopied] = useState(false);

    const solutionRef = useRef<HTMLDivElement>(null);
    const followEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (solution) {
            solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [solution]);

    useEffect(() => {
        followEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [followUps]);

    const handleSolve = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setError('');
        setSolution('');
        setFollowUps([]);
        setShowFollowUp(false);
        try {
            const result = await homeworkService.solve(question);
            setSolution(result);
        } catch {
            setError('Failed to solve the question. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFollowUp = async () => {
        if (!followInput.trim() || !solution) return;
        const msg = followInput.trim();
        setFollowUps((prev) => [...prev, { role: 'user', text: msg }]);
        setFollowInput('');
        setFollowLoading(true);
        try {
            const answer = await homeworkService.followUp(question, solution, msg);
            setFollowUps((prev) => [...prev, { role: 'assistant', text: answer }]);
        } catch {
            setFollowUps((prev) => [...prev, { role: 'assistant', text: 'Sorry, could not get a follow-up answer. Please try again.' }]);
        } finally {
            setFollowLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!solution) return;
        await navigator.clipboard.writeText(solution);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setQuestion('');
        setSolution('');
        setFollowUps([]);
        setShowFollowUp(false);
        setError('');
    };

    /** Render solution text with basic markdown-like formatting */
    const renderSolution = (text: string) => {
        const lines = text.split('\n');
        return lines.map((line, i) => {
            // Final Answer highlight
            if (line.startsWith('✅ Final Answer')) {
                return (
                    <div
                        key={i}
                        className="mt-4 p-4 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 font-semibold text-sm"
                    >
                        {line}
                    </div>
                );
            }
            // Numbered step headers (e.g. "Step 1:", "1.")
            if (/^(Step\s+\d+[:.:]|^\d+\.)/.test(line)) {
                return (
                    <p key={i} className="mt-3 text-primary font-semibold text-sm">
                        {line}
                    </p>
                );
            }
            // Code blocks (lines with backtick prefix)
            if (line.startsWith('```') || line.startsWith('    ')) {
                return (
                    <code key={i} className="block text-xs font-mono bg-black/30 px-3 py-0.5 rounded text-cyan-300">
                        {line.replace(/^    /, '')}
                    </code>
                );
            }
            // Empty line → spacer
            if (!line.trim()) return <br key={i} />;

            return (
                <p key={i} className="text-sm text-foreground/90 leading-relaxed">
                    {line}
                </p>
            );
        });
    };

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BookOpen className="text-primary" size={28} />
                        AI Homework Solver
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Get step-by-step solutions for math, science, coding &amp; more
                    </p>
                </div>
                {solution && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                        <RotateCcw size={13} /> New Question
                    </button>
                )}
            </div>

            {/* Example quick-fill cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EXAMPLE_QUESTIONS.map((ex) => (
                    <button
                        key={ex.label}
                        onClick={() => setQuestion(ex.q)}
                        className="glass-card rounded-xl p-3 text-left hover:ring-1 hover:ring-primary/30 transition-all group"
                    >
                        <ex.icon size={18} className="text-primary mb-1.5" />
                        <p className="text-xs font-semibold text-foreground">{ex.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{ex.q}</p>
                    </button>
                ))}
            </div>

            {/* Question Input */}
            <div className="glass-card rounded-xl p-5 space-y-4">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles size={15} className="text-primary" />
                    Enter your question
                </label>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSolve();
                    }}
                    placeholder="e.g. Solve 2x + 5 = 15 step by step&#10;     Explain how photosynthesis works&#10;     Write a binary search algorithm in Python..."
                    rows={5}
                    className="w-full bg-black/20 border border-white/10 text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none placeholder:text-muted-foreground/50"
                />
                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground">Tip: Press Ctrl+Enter to solve</p>
                    <button
                        onClick={handleSolve}
                        disabled={loading || !question.trim()}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 text-sm"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                        {loading ? 'Solving...' : 'Solve Question'}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="glass-card rounded-xl p-4 border border-destructive/30 text-destructive text-sm">
                    {error}
                </div>
            )}

            {/* Solution */}
            <AnimatePresence>
                {(loading || solution) && (
                    <motion.div
                        ref={solutionRef}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="glass-card rounded-xl p-5 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <BookOpen size={15} className="text-primary" />
                                Step-by-Step Solution
                            </h2>
                            {solution && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
                                >
                                    {copied ? <CheckCheck size={13} className="text-green-400" /> : <Copy size={13} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex items-center gap-3 text-muted-foreground text-sm py-4">
                                <Loader2 className="animate-spin text-primary" size={20} />
                                <span>Thinking through the solution...</span>
                            </div>
                        ) : (
                            <div className="space-y-1 leading-7">
                                {renderSolution(solution)}
                            </div>
                        )}

                        {/* Follow-up section */}
                        {solution && (
                            <div className="border-t border-white/5 pt-4">
                                <button
                                    onClick={() => setShowFollowUp(!showFollowUp)}
                                    className="flex items-center gap-2 text-sm text-primary font-semibold hover:opacity-80 transition-opacity"
                                >
                                    <MessageSquare size={15} />
                                    Ask a follow-up question
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform ${showFollowUp ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {showFollowUp && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 space-y-3">
                                                {/* Follow-up chat history */}
                                                {followUps.map((msg, i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div
                                                            className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${msg.role === 'user'
                                                                ? 'bg-primary/20 text-foreground'
                                                                : 'bg-white/5 text-foreground border border-white/5'
                                                                }`}
                                                        >
                                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {followLoading && (
                                                    <div className="flex justify-start">
                                                        <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                                            <Loader2 className="animate-spin text-primary" size={16} />
                                                        </div>
                                                    </div>
                                                )}
                                                <div ref={followEndRef} />

                                                {/* Follow-up input */}
                                                <div className="flex gap-2 mt-2">
                                                    <input
                                                        type="text"
                                                        value={followInput}
                                                        onChange={(e) => setFollowInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleFollowUp()}
                                                        placeholder="Ask a follow-up question..."
                                                        className="flex-1 bg-black/20 border border-white/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                                    />
                                                    <button
                                                        onClick={handleFollowUp}
                                                        disabled={followLoading || !followInput.trim()}
                                                        className="bg-gradient-to-r from-primary to-info text-primary-foreground p-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
                                                    >
                                                        <Send size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
