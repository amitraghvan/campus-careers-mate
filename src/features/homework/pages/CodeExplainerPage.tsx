/**
 * CodeExplainerPage — AI-powered code explanation and debugging tool.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code2,
    Bug,
    Wand2,
    Loader2,
    Copy,
    CheckCheck,
    AlertCircle,
    ChevronDown,
    TerminalSquare,
    RotateCcw,
} from 'lucide-react';
import { codeService } from '@/services/code.service';
import { cn } from '@/lib/utils';

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML/CSS' },
    { value: 'unknown', label: 'Other/Auto' },
];

export default function CodeExplainerPage() {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [loading, setLoading] = useState<'explain' | 'debug' | null>(null);
    const [error, setError] = useState('');

    // Results state
    const [explanation, setExplanation] = useState('');
    const [debugResult, setDebugResult] = useState<{ error: string; fixed_code: string } | null>(null);

    // Copy state
    const [copiedExpl, setCopiedExpl] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (explanation || debugResult) {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [explanation, debugResult]);

    const handleExplain = async () => {
        if (!code.trim()) return;
        setLoading('explain');
        setError('');
        setExplanation('');
        setDebugResult(null);
        try {
            const langLabel = LANGUAGES.find((l) => l.value === language)?.label || language;
            const res = await codeService.explain(langLabel, code);
            setExplanation(res);
        } catch {
            setError('Failed to explain code. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const handleDebug = async () => {
        if (!code.trim()) return;
        setLoading('debug');
        setError('');
        setExplanation('');
        setDebugResult(null);
        try {
            const langLabel = LANGUAGES.find((l) => l.value === language)?.label || language;
            const res = await codeService.debug(langLabel, code);
            setDebugResult(res);
        } catch {
            setError('Failed to debug code. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const handleCopy = async (text: string, type: 'expl' | 'code') => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        if (type === 'expl') {
            setCopiedExpl(true);
            setTimeout(() => setCopiedExpl(false), 2000);
        } else {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const handleReset = () => {
        setCode('');
        setExplanation('');
        setDebugResult(null);
        setError('');
    };

    const renderExplanation = (text: string) => {
        const lines = text.split('\n');
        return lines.map((line, i) => {
            if (/^(Step\s+\d+[:.:]|^\d+\.)/.test(line)) {
                return (
                    <p key={i} className="mt-3 text-info font-semibold text-sm">
                        {line}
                    </p>
                );
            }
            if (line.startsWith('```') || line.startsWith('    ')) {
                return (
                    <code key={i} className="block text-xs font-mono bg-black/40 px-3 py-1 rounded-md text-cyan-300 my-1">
                        {line.replace(/^ {4}/, '')}
                    </code>
                );
            }
            if (!line.trim()) return <br key={i} />;
            return (
                <p key={i} className="text-sm text-foreground/90 leading-relaxed">
                    {line}
                </p>
            );
        });
    };

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <TerminalSquare className="text-info" size={28} />
                        AI Code Explainer
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Understand complex code or debug pesky errors instantly.
                    </p>
                </div>
                {(explanation || debugResult) && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                        <RotateCcw size={13} /> Clear
                    </button>
                )}
            </div>

            {/* Editor Layout: Side by Side on large screens, stacked on small */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left side: Input */}
                <div className="space-y-4">
                    <div className="glass-card rounded-xl p-5 flex flex-col h-full min-h-[400px]">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Code2 size={16} className="text-info" />
                                Paste your code
                            </label>
                            <div className="relative">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="appearance-none bg-black/20 border border-white/10 text-foreground text-xs rounded-lg pl-3 pr-8 py-1.5 focus:ring-1 focus:ring-info/50 outline-none transition-all cursor-pointer"
                                >
                                    {LANGUAGES.map((l) => (
                                        <option key={l.value} value={l.value}>
                                            {l.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="// Paste your code here..."
                            spellCheck={false}
                            className="flex-1 w-full bg-[#0d1117] border border-white/5 text-gray-300 font-mono text-[13px] leading-relaxed rounded-xl p-4 focus:ring-1 focus:ring-info/50 focus:border-info transition-all outline-none resize-none"
                        />

                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                            <button
                                onClick={handleExplain}
                                disabled={!!loading || !code.trim()}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-foreground border border-white/10 font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 text-sm"
                            >
                                {loading === 'explain' ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} className="text-info" />}
                                Explain Code
                            </button>
                            <button
                                onClick={handleDebug}
                                disabled={!!loading || !code.trim()}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-destructive/80 to-destructive text-white font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 text-sm"
                            >
                                {loading === 'debug' ? <Loader2 className="animate-spin" size={16} /> : <Bug size={16} />}
                                Debug Code
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side: Results */}
                <div className="space-y-4">
                    {error && (
                        <div className="glass-card rounded-xl p-4 border border-destructive/30 text-destructive text-sm flex items-start gap-3">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {!explanation && !debugResult && !loading && !error && (
                        <div className="glass-card rounded-xl border-dashed border-2 border-white/10 h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                            <TerminalSquare size={48} className="mb-4 text-info/30" />
                            <p className="text-sm">Paste some code and click Explain or Debug to see the magic happen.</p>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass-card rounded-xl min-h-[400px] flex flex-col items-center justify-center text-muted-foreground"
                            >
                                <Loader2 className="animate-spin text-info mb-4" size={32} />
                                <p className="text-sm">
                                    {loading === 'explain' ? 'Analyzing logic and structure...' : 'Hunting down bugs...'}
                                </p>
                            </motion.div>
                        )}

                        {explanation && !loading && (
                            <motion.div
                                key="explain"
                                ref={resultRef}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card rounded-xl flex flex-col h-full min-h-[400px] overflow-hidden"
                            >
                                <div className="bg-white/5 border-b border-white/10 px-5 py-3 flex items-center justify-between shrink-0">
                                    <h2 className="text-sm font-semibold flex items-center gap-2">
                                        <Wand2 size={15} className="text-info" />
                                        Code Explanation
                                    </h2>
                                    <button
                                        onClick={() => handleCopy(explanation, 'expl')}
                                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                    >
                                        {copiedExpl ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <div className="p-5 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
                                    {renderExplanation(explanation)}
                                </div>
                            </motion.div>
                        )}

                        {debugResult && !loading && (
                            <motion.div
                                key="debug"
                                ref={resultRef}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-4 h-full"
                            >
                                {/* Error cause box */}
                                <div className="glass-card rounded-xl p-5 border border-destructive/30 bg-destructive/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
                                    <h3 className="text-sm font-semibold text-destructive flex items-center gap-2 mb-2">
                                        <Bug size={15} /> Error Analysis
                                    </h3>
                                    <p className="text-sm text-foreground/90">{debugResult.error}</p>
                                </div>

                                {/* Fixed code box */}
                                <div className="glass-card rounded-xl flex flex-col flex-1 min-h-[250px] overflow-hidden">
                                    <div className="bg-white/5 border-b border-white/10 px-5 py-3 flex items-center justify-between shrink-0">
                                        <h2 className="text-sm font-semibold flex items-center gap-2">
                                            <CheckCheck size={16} className="text-green-400" />
                                            Fixed Code
                                        </h2>
                                        <button
                                            onClick={() => handleCopy(debugResult.fixed_code, 'code')}
                                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {copiedCode ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
                                            {copiedCode ? 'Copied' : 'Copy Fix'}
                                        </button>
                                    </div>
                                    <div className="p-0 flex-1 relative bg-[#0d1117]">
                                        <textarea
                                            value={debugResult.fixed_code}
                                            readOnly
                                            className="absolute inset-0 w-full h-full bg-transparent text-green-300 font-mono text-[13px] leading-relaxed p-5 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
