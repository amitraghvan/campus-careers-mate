/**
 * MockExamPage.tsx — AI Powered Mock Exam Generator and Player.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit,
    BookOpen,
    Play,
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    Trophy,
    ChevronDown,
    FileText,
} from 'lucide-react';
import { mockExamService, MockExamQuestion } from '@/services/mockExam.service';
import { cn } from '@/lib/utils';

type ExamState = 'setup' | 'generating' | 'taking' | 'results';

export default function MockExamPage() {
    const [examState, setExamState] = useState<ExamState>('setup');
    const [error, setError] = useState('');

    // Setup Form State
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [questionCount, setQuestionCount] = useState<number>(5);
    const [uploadedContent, setUploadedContent] = useState('');

    // Exam Data State
    const [questions, setQuestions] = useState<MockExamQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    
    // Results State
    const [score, setScore] = useState(0);

    const handleGenerate = async () => {
        if (!subject.trim() || !topic.trim()) {
            setError('Please enter both subject and topic.');
            return;
        }
        setError('');
        setExamState('generating');
        
        try {
            const res = await mockExamService.generateMockExam({
                subject,
                topic,
                difficulty,
                questionCount,
                uploadedContent,
            });
            
            if (res.questions && res.questions.length > 0) {
                setQuestions(res.questions);
                setUserAnswers({});
                setExamState('taking');
            } else {
                throw new Error('Received empty questions array from AI.');
            }
        } catch (err: any) {
            console.error('Failed to generate exam:', err);
            setError('Failed to generate mock exam. Please try again or use simpler parameters.');
            setExamState('setup');
        }
    };

    const handleOptionSelect = (qIdx: number, option: string) => {
        setUserAnswers(prev => ({ ...prev, [qIdx]: option }));
    };

    const handleSubmitExam = () => {
        let newScore = 0;
        questions.forEach((q, i) => {
            if (userAnswers[i] === q.answer) {
                newScore++;
            }
        });
        setScore(newScore);
        setExamState('results');
    };

    const handleReset = () => {
        setQuestions([]);
        setUserAnswers({});
        setScore(0);
        setError('');
        setExamState('setup');
    };

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BrainCircuit className="text-primary" size={28} />
                        AI Mock Exams
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Generate robust, tailored mock tests instantly.
                    </p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {examState === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-card rounded-xl p-6 md:p-8 border border-white/5"
                    >
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Data Structures, React, Biology"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Specific Topic</label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. Binary Trees, Hooks Lifecycle"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Difficulty</label>
                                    <div className="relative">
                                        <select
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value)}
                                            className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 outline-none transition-all cursor-pointer"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Number of Questions</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(Number(e.target.value))}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                                    <span>Provide Context/Material <span className="text-muted-foreground font-normal">(Optional)</span></span>
                                </label>
                                <textarea
                                    value={uploadedContent}
                                    onChange={(e) => setUploadedContent(e.target.value)}
                                    placeholder="Paste syllabus notes, specific code, or text to test against..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-y min-h-[100px] font-mono text-gray-300"
                                />
                            </div>
                            
                            <button
                                onClick={handleGenerate}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                            >
                                <Play size={18} className="fill-current" />
                                Generate Exam Now
                            </button>
                        </div>
                    </motion.div>
                )}

                {examState === 'generating' && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]"
                    >
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <h2 className="text-lg font-bold">Curating Your Mock Exam...</h2>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            Our AI is analyzing {subject} - {topic} and drafting custom {difficulty.toLowerCase()} difficulty questions.
                        </p>
                    </motion.div>
                )}

                {examState === 'taking' && (
                    <motion.div
                        key="taking"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between glass-card px-5 py-3 rounded-xl border-l-4 border-l-primary">
                            <div>
                                <h2 className="font-bold text-lg">{subject} Exam</h2>
                                <p className="text-xs text-muted-foreground">{topic} • {difficulty} • {questions.length} Questions</p>
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-lg text-sm font-mono border border-white/10">
                                {Object.keys(userAnswers).length} / {questions.length} Answered
                            </div>
                        </div>

                        <div className="space-y-8">
                            {questions.map((q, qIdx) => (
                                <div key={qIdx} className="glass-card rounded-xl p-5 md:p-7 border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent" />
                                    <h3 className="text-base font-semibold leading-relaxed flex gap-3 text-foreground mb-5">
                                        <span className="text-primary mt-0.5">{qIdx + 1}.</span>
                                        {q.question}
                                    </h3>
                                    
                                    <div className="grid sm:grid-cols-2 gap-3 pl-6">
                                        {q.options.map((opt, oIdx) => {
                                            const isSelected = userAnswers[qIdx] === opt;
                                            return (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => handleOptionSelect(qIdx, opt)}
                                                    className={cn(
                                                        "text-left p-3 rounded-xl border text-sm transition-all focus:outline-none",
                                                        isSelected 
                                                            ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary),0.2)] text-white" 
                                                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                                                            isSelected ? "border-primary" : "border-slate-500"
                                                        )}>
                                                            {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                        </div>
                                                        {opt}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleSubmitExam}
                                disabled={Object.keys(userAnswers).length !== questions.length}
                                className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <CheckCircle2 size={18} />
                                Submit Exam
                            </button>
                        </div>
                    </motion.div>
                )}

                {examState === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Score Banner */}
                        <div className="glass-card rounded-2xl p-8 text-center border-t-4 border-t-primary flex flex-col items-center">
                            <Trophy className="text-yellow-400 mb-4" size={48} />
                            <h2 className="text-3xl font-black mb-2">Exam Completed!</h2>
                            <p className="text-muted-foreground text-sm mb-6">
                                You scored <strong>{score}</strong> out of <strong>{questions.length}</strong> correctly.
                            </p>
                            
                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full font-bold text-sm",
                                    score / questions.length >= 0.8 ? "bg-green-500/20 text-green-400" :
                                    score / questions.length >= 0.5 ? "bg-yellow-500/20 text-yellow-400" :
                                    "bg-red-500/20 text-red-400"
                                )}>
                                    {Math.round((score / questions.length) * 100)}% Accuracy
                                </span>
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-sm font-semibold px-4 py-1.5 rounded-full transition-colors border border-white/10"
                                >
                                    <RefreshCw size={14} /> Retake Exam
                                </button>
                            </div>
                        </div>

                        {/* Review Answers */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 px-1">
                                <BookOpen size={18} className="text-primary"/> Let's Review
                            </h3>
                            
                            {questions.map((q, qIdx) => {
                                const userAnswer = userAnswers[qIdx];
                                const isCorrect = userAnswer === q.answer;

                                return (
                                    <div key={qIdx} className={cn(
                                        "glass-card rounded-xl p-5 md:p-7 border relative overflow-hidden",
                                        isCorrect ? "border-green-500/30" : "border-red-500/30"
                                    )}>
                                        <div className={cn(
                                            "absolute top-0 left-0 w-1 h-full",
                                            isCorrect ? "bg-green-500" : "bg-red-500"
                                        )} />
                                        
                                        <h3 className="text-base font-semibold leading-relaxed flex gap-3 text-foreground mb-5">
                                            <span className="text-muted-foreground mt-0.5">{qIdx + 1}.</span>
                                            {q.question}
                                        </h3>
                                        
                                        <div className="grid sm:grid-cols-2 gap-3 pl-6 mb-6">
                                            {q.options.map((opt, oIdx) => {
                                                const isUserChoice = opt === userAnswer;
                                                const isCorrectAnswer = opt === q.answer;
                                                
                                                let style = "bg-white/5 border-white/10 text-slate-400 opacity-60";
                                                if (isCorrectAnswer) {
                                                    style = "bg-green-500/20 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.15)]";
                                                } else if (isUserChoice && !isCorrectAnswer) {
                                                    style = "bg-red-500/20 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.15)]";
                                                }
                                                
                                                return (
                                                    <div key={oIdx} className={cn("text-left p-3 rounded-xl border text-sm flex items-center justify-between", style)}>
                                                        <span>{opt}</span>
                                                        {isCorrectAnswer && <CheckCircle2 size={16} className="text-green-400" />}
                                                        {isUserChoice && !isCorrectAnswer && <XCircle size={16} className="text-red-400" />}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-4 border border-info/20 text-sm">
                                            <div className="flex items-center gap-2 font-semibold text-info mb-1">
                                                <BrainCircuit size={14} /> AI Explanation
                                            </div>
                                            <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

