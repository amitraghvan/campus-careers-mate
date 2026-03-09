/**
 * DocumentsPage — AI Learning Hub with tabbed interface.
 * Upload PDFs, chat about them, generate summaries, flashcards, and quizzes.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    FileText,
    MessageSquare,
    Sparkles,
    Layers,
    HelpCircle,
    Trash2,
    Send,
    Star,
    RefreshCw,
    CheckCircle,
    XCircle,
    BookOpen,
    Brain,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";
import {
    documentsService,
    type DocumentMeta,
    type FlashcardData,
    type QuizQuestion,
    type LearningStats,
} from "@/services/documents.service";

type Tab = "content" | "chat" | "ai-actions" | "flashcards" | "quizzes";

interface ChatMsg {
    role: "user" | "model";
    text: string;
}

export default function DocumentsPage() {
    // — State —
    const [documents, setDocuments] = useState<DocumentMeta[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<DocumentMeta | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("content");
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState<LearningStats | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Chat state
    const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // AI Actions state
    const [summary, setSummary] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [explainTopic, setExplainTopic] = useState("");
    const [explanation, setExplanation] = useState("");
    const [explainLoading, setExplainLoading] = useState(false);

    // Flashcards state
    const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
    const [flashcardsLoading, setFlashcardsLoading] = useState(false);
    const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

    // Quiz state
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    // — Load documents and stats —
    const loadDocuments = useCallback(async () => {
        try {
            const docs = await documentsService.listDocuments();
            setDocuments(docs);
        } catch { /* ignore */ }
    }, []);

    const loadStats = useCallback(async () => {
        try {
            const s = await documentsService.getLearningStats();
            setStats(s);
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        loadDocuments();
        loadStats();
    }, [loadDocuments, loadStats]);

    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    // — Handlers —
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const doc = await documentsService.uploadDocument(file);
            setDocuments((prev) => [doc, ...prev]);
            setSelectedDoc(doc);
            loadStats();
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await documentsService.deleteDocument(id);
            setDocuments((prev) => prev.filter((d) => d.id !== id));
            if (selectedDoc?.id === id) setSelectedDoc(null);
            loadStats();
        } catch { /* ignore */ }
    };

    const handleSelectDoc = (doc: DocumentMeta) => {
        setSelectedDoc(doc);
        setChatHistory([]);
        setSummary("");
        setExplanation("");
        setFlashcards([]);
        setQuizQuestions([]);
        setQuizSubmitted(false);
        setQuizAnswers({});
    };

    // Chat
    const handleSendChat = async () => {
        if (!chatInput.trim() || !selectedDoc) return;
        const userMsg: ChatMsg = { role: "user", text: chatInput };
        setChatHistory((prev) => [...prev, userMsg]);
        setChatInput("");
        setChatLoading(true);
        try {
            const answer = await documentsService.chatWithDocument(
                selectedDoc.id,
                chatInput,
                chatHistory.map((m) => ({ role: m.role === "model" ? "assistant" : "user", content: m.text })),
            );
            setChatHistory((prev) => [...prev, { role: "model", text: answer }]);
        } catch {
            setChatHistory((prev) => [...prev, { role: "model", text: "Sorry, something went wrong." }]);
        } finally {
            setChatLoading(false);
        }
    };

    // Summary
    const handleSummary = async () => {
        if (!selectedDoc) return;
        setSummaryLoading(true);
        try {
            const s = await documentsService.generateSummary(selectedDoc.id);
            setSummary(s);
        } catch { setSummary("Failed to generate summary."); }
        finally { setSummaryLoading(false); }
    };

    // Explain
    const handleExplain = async () => {
        if (!selectedDoc || !explainTopic.trim()) return;
        setExplainLoading(true);
        try {
            const e = await documentsService.explainConcept(selectedDoc.id, explainTopic);
            setExplanation(e);
        } catch { setExplanation("Failed to explain."); }
        finally { setExplainLoading(false); }
    };

    // Flashcards
    const handleGenerateFlashcards = async () => {
        if (!selectedDoc) return;
        setFlashcardsLoading(true);
        try {
            const cards = await documentsService.generateFlashcards(selectedDoc.id);
            setFlashcards(cards);
            loadStats();
        } catch { /* ignore */ }
        finally { setFlashcardsLoading(false); }
    };

    const handleLoadFlashcards = async () => {
        if (!selectedDoc) return;
        try {
            const cards = await documentsService.getFlashcards(selectedDoc.id);
            setFlashcards(cards);
        } catch { /* ignore */ }
    };

    const toggleFlip = (id: string) => {
        setFlippedCards((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleFav = async (id: string) => {
        try {
            const updated = await documentsService.toggleFavorite(id);
            setFlashcards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        } catch { /* ignore */ }
    };

    // Quiz
    const handleGenerateQuiz = async () => {
        if (!selectedDoc) return;
        setQuizLoading(true);
        setQuizSubmitted(false);
        setQuizAnswers({});
        try {
            const questions = await documentsService.generateQuiz(selectedDoc.id);
            setQuizQuestions(questions);
        } catch { /* ignore */ }
        finally { setQuizLoading(false); }
    };

    const handleSubmitQuiz = async () => {
        if (!selectedDoc) return;
        let score = 0;
        quizQuestions.forEach((q, i) => {
            if (quizAnswers[i] === q.correctAnswer) score++;
        });
        setQuizScore(score);
        setQuizSubmitted(true);
        try {
            await documentsService.saveQuizResult(selectedDoc.id, {
                questions: quizQuestions,
                score,
                totalQuestions: quizQuestions.length,
            });
            loadStats();
        } catch { /* ignore */ }
    };

    useEffect(() => {
        if (selectedDoc) handleLoadFlashcards();
    }, [selectedDoc]);

    // — Tabs config —
    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "content", label: "Content", icon: <BookOpen size={16} /> },
        { id: "chat", label: "Chat", icon: <MessageSquare size={16} /> },
        { id: "ai-actions", label: "AI Actions", icon: <Sparkles size={16} /> },
        { id: "flashcards", label: "Flashcards", icon: <Layers size={16} /> },
        { id: "quizzes", label: "Quizzes", icon: <HelpCircle size={16} /> },
    ];

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header and Stats */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Brain className="text-primary" size={28} />
                        AI Learning Hub
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Upload documents and let AI help you study smarter
                    </p>
                </div>
                {stats && (
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { label: "Documents", value: stats.totalDocuments, icon: <FileText size={14} /> },
                            { label: "Flashcards", value: stats.totalFlashcards, icon: <Layers size={14} /> },
                            { label: "Quizzes", value: stats.totalQuizzes, icon: <HelpCircle size={14} /> },
                            { label: "Avg Score", value: `${stats.averageScore}%`, icon: <BarChart3 size={14} /> },
                        ].map((s) => (
                            <div key={s.label} className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
                                <span className="text-primary">{s.icon}</span>
                                <div>
                                    <p className="text-xs text-muted-foreground">{s.label}</p>
                                    <p className="text-sm font-bold text-foreground">{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Document Sidebar */}
                <div className="w-full lg:w-72 shrink-0 space-y-4">
                    <div className="glass-card rounded-xl p-4">
                        <input type="file" accept=".pdf" ref={fileRef} onChange={handleUpload} className="hidden" />
                        <button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                            {uploading ? "Uploading..." : "AI Learning Hub"}
                        </button>
                    </div>

                    <div className="glass-card rounded-xl p-3 space-y-1 max-h-[50vh] overflow-y-auto">
                        <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                            My Documents
                        </p>
                        {documents.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-6">
                                No documents yet. Upload a PDF to get started!
                            </p>
                        ) : (
                            documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => handleSelectDoc(doc)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all group ${selectedDoc?.id === doc.id
                                        ? "bg-primary/10 ring-1 ring-primary/30"
                                        : "hover:bg-white/5"
                                        }`}
                                >
                                    <FileText size={16} className="text-primary shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground truncate">{doc.fileName}</p>
                                        <p className="text-xs text-muted-foreground">{formatSize(doc.fileSize)}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {!selectedDoc ? (
                        <div className="glass-card rounded-xl flex flex-col items-center justify-center py-20 text-center">
                            <Brain size={48} className="text-muted-foreground mb-4" />
                            <h2 className="text-lg font-semibold text-foreground">Select a Document</h2>
                            <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                                Upload or select a document from the sidebar to start using AI learning tools.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Tabs */}
                            <div className="glass-card rounded-xl p-1 flex gap-1 overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? "bg-primary/15 text-primary ring-1 ring-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                            }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* ───── CONTENT TAB ───── */}
                                    {activeTab === "content" && (
                                        <div className="glass-card rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                                <BookOpen size={20} className="text-primary" />
                                                {selectedDoc.fileName}
                                            </h3>
                                            <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden" style={{ height: "70vh" }}>
                                                <object
                                                    data={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${selectedDoc.fileUrl}#toolbar=1&navpanes=1`}
                                                    type="application/pdf"
                                                    className="w-full h-full"
                                                >
                                                    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                                                        <FileText size={40} className="text-muted-foreground" />
                                                        <p className="text-sm text-muted-foreground">Your browser cannot display this PDF inline.</p>
                                                        <a
                                                            href={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${selectedDoc.fileUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
                                                        >
                                                            <Upload size={16} /> Open PDF in new tab
                                                        </a>
                                                    </div>
                                                </object>
                                            </div>
                                        </div>
                                    )}

                                    {/* ───── CHAT TAB ───── */}
                                    {activeTab === "chat" && (
                                        <div className="glass-card rounded-xl p-4 flex flex-col" style={{ height: "70vh" }}>
                                            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                                <MessageSquare size={16} className="text-primary" />
                                                Chat about: {selectedDoc.fileName}
                                            </h3>

                                            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
                                                {chatHistory.length === 0 && (
                                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                                        <MessageSquare size={32} className="text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground">
                                                            Ask anything about this document!
                                                        </p>
                                                    </div>
                                                )}
                                                {chatHistory.map((msg, i) => (
                                                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                        <div
                                                            className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${msg.role === "user"
                                                                ? "bg-primary/20 text-foreground"
                                                                : "bg-white/5 text-foreground border border-white/5"
                                                                }`}
                                                        >
                                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {chatLoading && (
                                                    <div className="flex justify-start">
                                                        <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                                            <Loader2 className="animate-spin text-primary" size={16} />
                                                        </div>
                                                    </div>
                                                )}
                                                <div ref={chatEndRef} />
                                            </div>

                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={chatInput}
                                                    onChange={(e) => setChatInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                                                    placeholder="Ask about this document..."
                                                    className="flex-1 bg-black/20 border border-white/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                                />
                                                <button
                                                    onClick={handleSendChat}
                                                    disabled={chatLoading || !chatInput.trim()}
                                                    className="bg-gradient-to-r from-primary to-info text-primary-foreground p-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                                >
                                                    <Send size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* ───── AI ACTIONS TAB ───── */}
                                    {activeTab === "ai-actions" && (
                                        <div className="space-y-4">
                                            {/* Summary */}
                                            <div className="glass-card rounded-xl p-5">
                                                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                                    <Sparkles size={16} className="text-primary" />
                                                    Generate Summary
                                                </h3>
                                                <button
                                                    onClick={handleSummary}
                                                    disabled={summaryLoading}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                                                >
                                                    {summaryLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                                    {summaryLoading ? "Generating..." : "Generate Summary"}
                                                </button>
                                                {summary && (
                                                    <div className="mt-4 bg-black/20 rounded-xl border border-white/5 p-4">
                                                        <p className="text-sm text-foreground whitespace-pre-wrap">{summary}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Concept Explainer */}
                                            <div className="glass-card rounded-xl p-5">
                                                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                                    <Brain size={16} className="text-primary" />
                                                    Concept Explainer
                                                </h3>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={explainTopic}
                                                        onChange={(e) => setExplainTopic(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && handleExplain()}
                                                        placeholder="Enter topic name..."
                                                        className="flex-1 bg-black/20 border border-white/10 text-foreground rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                                    />
                                                    <button
                                                        onClick={handleExplain}
                                                        disabled={explainLoading || !explainTopic.trim()}
                                                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                                                    >
                                                        {explainLoading ? <Loader2 className="animate-spin" size={16} /> : <Brain size={16} />}
                                                        Explain
                                                    </button>
                                                </div>
                                                {explanation && (
                                                    <div className="mt-4 bg-black/20 rounded-xl border border-white/5 p-4">
                                                        <p className="text-sm text-foreground whitespace-pre-wrap">{explanation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ───── FLASHCARDS TAB ───── */}
                                    {activeTab === "flashcards" && (
                                        <div className="space-y-4">
                                            <div className="glass-card rounded-xl p-4 flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                    <Layers size={16} className="text-primary" />
                                                    Flashcards ({flashcards.length})
                                                </h3>
                                                <button
                                                    onClick={handleGenerateFlashcards}
                                                    disabled={flashcardsLoading}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                                                >
                                                    {flashcardsLoading ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                                                    {flashcardsLoading ? "Generating..." : "Generate Flashcards"}
                                                </button>
                                            </div>

                                            {flashcards.length === 0 ? (
                                                <div className="glass-card rounded-xl p-12 text-center">
                                                    <Layers size={36} className="text-muted-foreground mx-auto mb-3" />
                                                    <p className="text-sm text-muted-foreground">
                                                        No flashcards yet. Click "Generate Flashcards" to create them!
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {flashcards.map((card) => (
                                                        <div
                                                            key={card.id}
                                                            onClick={() => toggleFlip(card.id)}
                                                            className="glass-card rounded-xl p-5 cursor-pointer hover:ring-1 hover:ring-primary/20 transition-all min-h-[140px] flex flex-col justify-between relative group"
                                                        >
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleFav(card.id); }}
                                                                className="absolute top-3 right-3"
                                                            >
                                                                <Star
                                                                    size={16}
                                                                    className={card.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}
                                                                />
                                                            </button>
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                                                                    {flippedCards.has(card.id) ? "Answer" : "Question"}
                                                                </p>
                                                                <p className="text-sm text-foreground">
                                                                    {flippedCards.has(card.id) ? card.answer : card.question}
                                                                </p>
                                                            </div>
                                                            <p className="text-[10px] text-muted-foreground mt-3">Click to flip</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ───── QUIZZES TAB ───── */}
                                    {activeTab === "quizzes" && (
                                        <div className="space-y-4">
                                            <div className="glass-card rounded-xl p-4 flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                    <HelpCircle size={16} className="text-primary" />
                                                    Quiz
                                                </h3>
                                                <button
                                                    onClick={handleGenerateQuiz}
                                                    disabled={quizLoading}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                                                >
                                                    {quizLoading ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                                                    {quizLoading ? "Generating..." : "Generate Quiz"}
                                                </button>
                                            </div>

                                            {quizSubmitted && (
                                                <div className="glass-card rounded-xl p-5 text-center glow-primary">
                                                    <h3 className="text-xl font-bold text-foreground mb-1">
                                                        Score: {quizScore}/{quizQuestions.length}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {quizScore === quizQuestions.length
                                                            ? "🎉 Perfect! You nailed it!"
                                                            : quizScore >= quizQuestions.length / 2
                                                                ? "👍 Good job! Keep studying!"
                                                                : "📚 Review the material and try again!"}
                                                    </p>
                                                </div>
                                            )}

                                            {quizQuestions.length === 0 ? (
                                                <div className="glass-card rounded-xl p-12 text-center">
                                                    <HelpCircle size={36} className="text-muted-foreground mx-auto mb-3" />
                                                    <p className="text-sm text-muted-foreground">
                                                        No quiz yet. Click "Generate Quiz" to create one!
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {quizQuestions.map((q, qi) => (
                                                        <div key={qi} className="glass-card rounded-xl p-5">
                                                            <p className="text-sm font-semibold text-foreground mb-3">
                                                                Q{qi + 1}. {q.question}
                                                            </p>
                                                            <div className="space-y-2">
                                                                {q.options.map((opt, oi) => {
                                                                    const selected = quizAnswers[qi] === opt;
                                                                    const isCorrect = quizSubmitted && opt === q.correctAnswer;
                                                                    const isWrong = quizSubmitted && selected && opt !== q.correctAnswer;
                                                                    return (
                                                                        <button
                                                                            key={oi}
                                                                            onClick={() => {
                                                                                if (quizSubmitted) return;
                                                                                setQuizAnswers((prev) => ({ ...prev, [qi]: opt }));
                                                                            }}
                                                                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 ${isCorrect
                                                                                ? "bg-green-500/20 ring-1 ring-green-500/50 text-green-300"
                                                                                : isWrong
                                                                                    ? "bg-red-500/20 ring-1 ring-red-500/50 text-red-300"
                                                                                    : selected
                                                                                        ? "bg-primary/15 ring-1 ring-primary/30 text-foreground"
                                                                                        : "bg-black/20 hover:bg-white/5 text-foreground border border-white/5"
                                                                                }`}
                                                                        >
                                                                            {isCorrect && <CheckCircle size={14} />}
                                                                            {isWrong && <XCircle size={14} />}
                                                                            {opt}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {!quizSubmitted && (
                                                        <button
                                                            onClick={handleSubmitQuiz}
                                                            disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                                                            className="w-full bg-gradient-to-r from-primary to-info text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                                        >
                                                            Submit Quiz
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
