/**
 * PythonEditor Component
 * Professional interactive code editor with rich live syntax highlighting
 * (keywords, builtins, strings, numbers, booleans, comments, operators),
 * synchronized line numbers, input streams, execution, and test assertions.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Loader2,
    Terminal,
    Layers,
    ChevronDown,
    ChevronUp,
    Sparkles,
    AlertCircle,
    Check,
    Clock,
    Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pythonRunner, ExecutionResult, SuiteResult } from '../services/python-runner.service';
import { TestCase } from '../types/python.types';
import { cn } from '@/lib/utils';

interface PythonEditorProps {
    initialCode: string;
    starterCode?: string;
    testCases?: TestCase[];
    onSubmitSuccess?: (code: string) => void;
    onSuccess?: (code: string) => void;
    submitButtonLabel?: string;
    submitButtonText?: string;
    hideSubmit?: boolean;
    entityId?: string;
    onCodeChange?: (code: string) => void;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * High-performance Python live syntax highlighter.
 * Generates beautiful VS Code Dark+ styled HTML spans.
 */
function highlightPythonCode(code: string): string {
    const lines = code.split('\n');
    return lines
        .map((line) => {
            if (!line) return '&nbsp;';

            let highlighted = '';
            let i = 0;

            while (i < line.length) {
                // 1. Comments: # ...
                if (line[i] === '#') {
                    const comment = line.slice(i);
                    highlighted += `<span class="text-slate-400 italic">${escapeHtml(comment)}</span>`;
                    break;
                }

                // 2. Strings: "..." or '...'
                if (line[i] === '"' || line[i] === "'") {
                    const quote = line[i];
                    let j = i + 1;
                    while (j < line.length) {
                        if (line[j] === quote && line[j - 1] !== '\\') {
                            j++;
                            break;
                        }
                        j++;
                    }
                    const str = line.slice(i, j);
                    highlighted += `<span class="text-emerald-400">${escapeHtml(str)}</span>`;
                    i = j;
                    continue;
                }

                // 3. Numbers
                const numMatch = line.slice(i).match(/^\d+(\.\d+)?/);
                if (numMatch && (i === 0 || /[\s([{} =+\-*/%,:<>]/.test(line[i - 1]))) {
                    highlighted += `<span class="text-amber-400 font-mono">${numMatch[0]}</span>`;
                    i += numMatch[0].length;
                    continue;
                }

                // 4. Identifiers, Keywords, Builtins, Booleans
                const idMatch = line.slice(i).match(/^[a-zA-Z_]\w*/);
                if (idMatch) {
                    const word = idMatch[0];
                    const keywords = [
                        'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in',
                        'is', 'not', 'and', 'or', 'break', 'continue', 'pass', 'import',
                        'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'lambda',
                        'yield', 'class', 'global', 'nonlocal', 'assert'
                    ];
                    const builtins = [
                        'print', 'input', 'range', 'len', 'type', 'int', 'float', 'str',
                        'bool', 'list', 'dict', 'set', 'tuple', 'round', 'abs', 'min',
                        'max', 'sum', 'sorted', 'enumerate', 'zip', 'map', 'filter',
                        'open', 'randint', 'choice', 'random', 'randrange', 'shuffle', 'seed'
                    ];
                    const constants = ['True', 'False', 'None'];

                    if (keywords.includes(word)) {
                        highlighted += `<span class="text-purple-400 font-semibold">${word}</span>`;
                    } else if (constants.includes(word)) {
                        highlighted += `<span class="text-orange-400 font-semibold">${word}</span>`;
                    } else if (builtins.includes(word)) {
                        highlighted += `<span class="text-sky-400 font-medium">${word}</span>`;
                    } else {
                        highlighted += `<span class="text-slate-100">${escapeHtml(word)}</span>`;
                    }
                    i += word.length;
                    continue;
                }

                // 5. Operators
                const opChar = line[i];
                if (/^[=+\-*/%<>!&|^~]/.test(opChar)) {
                    highlighted += `<span class="text-pink-400">${escapeHtml(opChar)}</span>`;
                } else if (/^[()[\]{}:,.]/.test(opChar)) {
                    highlighted += `<span class="text-slate-300 font-bold">${escapeHtml(opChar)}</span>`;
                } else {
                    highlighted += escapeHtml(opChar);
                }
                i++;
            }

            return highlighted;
        })
        .join('\n');
}

export function PythonEditor({
    initialCode,
    starterCode,
    testCases = [],
    onSubmitSuccess,
    onSuccess,
    submitButtonLabel,
    submitButtonText = 'Submit Solution',
    hideSubmit = false,
    entityId,
    onCodeChange,
}: PythonEditorProps) {
    const [code, setCode] = useState(initialCode);
    const [inputBuffer, setInputBuffer] = useState('');
    const [showInputPanel, setShowInputPanel] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
    const [suiteResult, setSuiteResult] = useState<SuiteResult | null>(null);
    const [activeTab, setActiveTab] = useState<'console' | 'tests'>(testCases.length > 0 ? 'tests' : 'console');
    const [copied, setCopied] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const lineNumRef = useRef<HTMLDivElement>(null);

    const finalSubmitLabel = submitButtonLabel || submitButtonText;
    const finalSubmitHandler = onSubmitSuccess || onSuccess;

    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    const highlightedCodeHtml = useMemo(() => {
        return highlightPythonCode(code);
    }, [code]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        onCodeChange?.(newCode);
    };

    const handleScroll = () => {
        if (textareaRef.current) {
            const top = textareaRef.current.scrollTop;
            const left = textareaRef.current.scrollLeft;

            if (preRef.current) {
                preRef.current.scrollTop = top;
                preRef.current.scrollLeft = left;
            }
            if (lineNumRef.current) {
                lineNumRef.current.scrollTop = top;
            }
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setActiveTab('console');
        try {
            const res = await pythonRunner.runCode(code, inputBuffer);
            setExecutionResult(res);
        } catch (err: any) {
            setExecutionResult({
                success: false,
                output: '',
                error: err.message || 'Execution error',
                executionTimeMs: 0,
            });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (testCases.length === 0) {
            finalSubmitHandler?.(code);
            return;
        }

        setIsSubmitting(true);
        setActiveTab('tests');
        try {
            const suite = await pythonRunner.runTestSuite(code, testCases);
            setSuiteResult(suite);
            if (suite.allPassed) {
                finalSubmitHandler?.(code);
            }
        } catch (err: any) {
            console.error('Test suite error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        const resetTo = starterCode !== undefined ? starterCode : initialCode;
        setCode(resetTo);
        setExecutionResult(null);
        setSuiteResult(null);
        onCodeChange?.(resetTo);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const updated = code.substring(0, start) + '    ' + code.substring(end);
            setCode(updated);
            onCodeChange?.(updated);
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
                }
            }, 0);
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            handleRun();
        }
    };

    const lineNumbers = code.split('\n').map((_, i) => i + 1);

    return (
        <div className="rounded-2xl border border-border/60 bg-card/90 backdrop-blur-md overflow-hidden shadow-elevated flex flex-col">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/30 border-b border-border/40 text-xs">
                <div className="flex items-center gap-2 font-mono text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
                    <span className="text-foreground font-semibold">main.py</span>
                    <span className="text-xs text-muted-foreground/70">(Python 3.12)</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                        title="Copy code"
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                        {copied ? 'Copied' : 'Copy'}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInputPanel(!showInputPanel)}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        Standard Input {showInputPanel ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                        title="Reset Code"
                    >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Reset
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                        className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all glow-primary"
                    >
                        {isRunning ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                        ) : (
                            <Play className="h-3.5 w-3.5 fill-current mr-1" />
                        )}
                        Run Code
                    </Button>

                    {!hideSubmit && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleSubmit}
                            disabled={isRunning || isSubmitting}
                            className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all glow-accent"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : (
                                <Sparkles className="h-3.5 w-3.5 mr-1" />
                            )}
                            {finalSubmitLabel}
                        </Button>
                    )}
                </div>
            </div>

            {/* Optional Input Panel */}
            <AnimatePresence>
                {showInputPanel && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b border-border/40 bg-secondary/20 p-3"
                    >
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">
                            Standard Input (stdin) — separate lines for multiple input() prompts:
                        </label>
                        <textarea
                            value={inputBuffer}
                            onChange={(e) => setInputBuffer(e.target.value)}
                            placeholder="Enter test input lines here..."
                            rows={2}
                            className="w-full text-xs font-mono bg-background/60 border border-border/50 rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Code Editor Body with Live Colorful Syntax Highlighting */}
            <div className="relative flex bg-[#0d1117] h-[260px] min-h-[220px] max-h-[400px] overflow-hidden font-mono text-sm">
                {/* Line Numbers */}
                <div
                    ref={lineNumRef}
                    className="py-3 px-3 select-none text-right font-mono text-xs text-muted-foreground/40 border-r border-border/20 bg-[#0d1117] w-11 shrink-0 overflow-hidden h-full"
                >
                    {lineNumbers.map((num) => (
                        <div key={num} className="leading-6 h-6">
                            {num}
                        </div>
                    ))}
                </div>

                {/* Editor Container with Synchronized Layers */}
                <div className="relative flex-1 h-full min-h-full overflow-hidden">
                    {/* Background Syntax Highlighted Layer */}
                    <pre
                        ref={preRef}
                        aria-hidden="true"
                        className="absolute inset-0 m-0 p-3 pointer-events-none font-mono text-sm leading-6 whitespace-pre overflow-hidden z-0"
                        dangerouslySetInnerHTML={{ __html: highlightedCodeHtml + '\n&nbsp;' }}
                    />

                    {/* Foreground Transparent Interactive Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onScroll={handleScroll}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        className="absolute inset-0 m-0 p-3 w-full h-full bg-transparent text-transparent caret-sky-400 font-mono text-sm leading-6 resize-none focus:outline-none selection:bg-primary/30 selection:text-transparent whitespace-pre overflow-auto z-10"
                        placeholder="# Write your Python code here..."
                    />
                </div>
            </div>

            {/* Output & Test Results Panel */}
            <div className="border-t border-border/40 bg-[#0a0d14] flex flex-col">
                {/* Tabs */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/20 border-b border-border/20 text-xs">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('console')}
                            className={cn(
                                'flex items-center gap-1 px-2.5 py-1 rounded transition-colors',
                                activeTab === 'console'
                                    ? 'bg-secondary text-foreground font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Terminal className="h-3 w-3" />
                            Output Console
                        </button>

                        {testCases.length > 0 && (
                            <button
                                onClick={() => setActiveTab('tests')}
                                className={cn(
                                    'flex items-center gap-1 px-2.5 py-1 rounded transition-colors',
                                    activeTab === 'tests'
                                        ? 'bg-secondary text-foreground font-semibold'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <Layers className="h-3 w-3" />
                                Test Cases ({testCases.length})
                                {suiteResult && (
                                    <span
                                        className={cn(
                                            'ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold',
                                            suiteResult.allPassed
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-rose-500/20 text-rose-400'
                                        )}
                                    >
                                        {suiteResult.passCount}/{suiteResult.totalCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>

                    {executionResult && (
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                            <Clock className="h-3 w-3" />
                            <span>{executionResult.executionTimeMs}ms</span>
                        </div>
                    )}
                </div>

                {/* Tab 1: Console Output */}
                {activeTab === 'console' && (
                    <div className="p-4 font-mono text-xs min-h-[90px] max-h-[220px] overflow-auto leading-relaxed">
                        {isRunning ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-2">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span>Running Python code...</span>
                            </div>
                        ) : executionResult ? (
                            <div className="space-y-2">
                                {executionResult.success ? (
                                    executionResult.output ? (
                                        <pre className="text-emerald-400 whitespace-pre-wrap">
                                            {executionResult.output}
                                        </pre>
                                    ) : (
                                        <span className="text-muted-foreground italic">
                                            Program executed successfully with no standard output.
                                        </span>
                                    )
                                ) : (
                                    <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 space-y-1">
                                        <div className="flex items-center gap-1.5 font-bold text-rose-400 text-xs">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>Execution Failed:</span>
                                        </div>
                                        <pre className="whitespace-pre-wrap font-mono text-xs pl-5">
                                            {executionResult.error}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-muted-foreground/60 italic">
                                Click "Run Code" or press Ctrl+Enter to execute.
                            </span>
                        )}
                    </div>
                )}

                {/* Tab 2: Test Suite Results */}
                {activeTab === 'tests' && (
                    <div className="p-4 space-y-3 min-h-[90px] max-h-[260px] overflow-auto">
                        {isSubmitting ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-2">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span>Running verification test cases...</span>
                            </div>
                        ) : suiteResult ? (
                            <div className="space-y-3">
                                <div
                                    className={cn(
                                        'p-3 rounded-xl border flex items-center justify-between',
                                        suiteResult.allPassed
                                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                                            : 'bg-rose-950/20 border-rose-500/40 text-rose-400'
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {suiteResult.allPassed ? (
                                            <CheckCircle2 className="h-5 w-5" />
                                        ) : (
                                            <XCircle className="h-5 w-5" />
                                        )}
                                        <span className="font-bold text-xs">
                                            {suiteResult.allPassed
                                                ? 'All Test Cases Passed! 🎉'
                                                : `${suiteResult.passCount} of ${suiteResult.totalCount} Test Cases Passed`}
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs">{suiteResult.executionTimeMs}ms</span>
                                </div>

                                <div className="space-y-2">
                                    {suiteResult.testResults.map((tr) => (
                                        <div
                                            key={tr.testCaseIndex}
                                            className={cn(
                                                'p-3 rounded-lg border text-xs font-mono space-y-1.5',
                                                tr.passed
                                                    ? 'bg-card/40 border-emerald-500/20'
                                                    : 'bg-card/40 border-rose-500/20'
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-foreground">
                                                    Case #{tr.testCaseIndex + 1}: {tr.description}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'font-bold text-[11px]',
                                                        tr.passed ? 'text-emerald-400' : 'text-rose-400'
                                                    )}
                                                >
                                                    {tr.passed ? 'Passed ✓' : 'Failed ✗'}
                                                </span>
                                            </div>

                                            {!tr.passed && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                                                    <div className="p-2 rounded bg-secondary/30 border border-border/30">
                                                        <span className="text-muted-foreground block font-sans">
                                                            Expected Output:
                                                        </span>
                                                        <pre className="text-emerald-300 mt-0.5 whitespace-pre-wrap">
                                                            {tr.expected}
                                                        </pre>
                                                    </div>
                                                    <div className="p-2 rounded bg-secondary/30 border border-border/30">
                                                        <span className="text-muted-foreground block font-sans">
                                                            Actual Output:
                                                        </span>
                                                        <pre className="text-rose-300 mt-0.5 whitespace-pre-wrap">
                                                            {tr.actual || tr.error || '[empty]'}
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <span className="text-xs text-muted-foreground block">
                                    Click "Submit Solution" to run your code against {testCases.length} automated test cases:
                                </span>
                                <div className="space-y-1.5">
                                    {testCases.map((tc, idx) => (
                                        <div
                                            key={idx}
                                            className="p-2.5 rounded-lg border border-border/40 bg-secondary/20 flex items-center justify-between text-xs"
                                        >
                                            <span className="font-medium text-foreground">
                                                Test #{idx + 1}: {tc.description}
                                            </span>
                                            <span className="text-muted-foreground font-mono text-[11px]">
                                                Pending
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
