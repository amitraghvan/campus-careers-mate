/**
 * AIChatWidget — floating chatbot with Gemini AI.
 * Appears on all dashboard pages via DashboardLayout.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle, X, Send, Trash2, Bot, User, Loader2, Sparkles,
} from "lucide-react";
import { chatService, type ChatMessage } from "@/services/chat.service";

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(() => chatService.getHistory());
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        const userMsg: ChatMessage = {
            role: "user",
            text,
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const reply = await chatService.sendMessage(text, messages);
            const aiMsg: ChatMessage = {
                role: "model",
                text: reply,
                timestamp: new Date().toISOString(),
            };
            const final = [...updatedMessages, aiMsg];
            setMessages(final);
            chatService.saveHistory(final);
        } catch {
            const errorMsg: ChatMessage = {
                role: "model",
                text: "Something went wrong. Please try again! 🔄",
                timestamp: new Date().toISOString(),
            };
            const final = [...updatedMessages, errorMsg];
            setMessages(final);
            chatService.saveHistory(final);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([]);
        chatService.clearHistory();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary cursor-pointer"
                    >
                        <MessageCircle className="h-6 w-6 text-primary-foreground" />
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[520px] flex flex-col rounded-2xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-gradient-to-r from-primary/10 to-accent/10">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-display font-semibold">PlaceTrack AI</h3>
                                    <p className="text-[10px] text-muted-foreground">Placement assistant • Powered by Gemini</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={handleClear}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    title="Clear chat"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && !isLoading && (
                                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                                        <Bot className="h-8 w-8 text-primary" />
                                    </div>
                                    <h4 className="text-sm font-semibold mb-1">Hey! I'm PlaceTrack AI 👋</h4>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Your placement prep buddy. Ask me anything about interviews, resumes, or placement strategy!
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {[
                                            "Interview tips for Google",
                                            "How to crack placement season?",
                                            "Resume format for freshers",
                                        ].map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => { setInput(q); }}
                                                className="text-[11px] px-3 py-1.5 rounded-full border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "model" && (
                                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-0.5">
                                            <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-md"
                                                : "bg-secondary/70 text-foreground rounded-bl-md"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                    </div>
                                    {msg.role === "user" && (
                                        <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-2.5"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                                        <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                                    </div>
                                    <div className="bg-secondary/70 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-primary" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-primary" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-primary" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="border-t border-border/30 p-3">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask me anything about placements..."
                                    disabled={isLoading}
                                    className="flex-1 bg-secondary/50 border border-border/30 rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50 transition-colors"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

