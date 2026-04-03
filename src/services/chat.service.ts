/**
 * Chat Service — Gemini AI integration for PlaceTrack.
 * Calls the Google Generative AI SDK directly from the frontend.
 */

import { api } from "@/lib/api";

export interface ChatMessage {
    role: "user" | "model";
    text: string;
    timestamp: string;
}

const STORAGE_KEY = "placetrack-chat-history";

export const chatService = {
    getHistory(): ChatMessage[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    saveHistory(messages: ChatMessage[]): void {
        try {
            // Keep last 50 messages to avoid localStorage bloat
            const trimmed = messages.slice(-50);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        } catch (e) {
            console.error("[Chat] Failed to save history:", e);
        }
    },

    clearHistory(): void {
        localStorage.removeItem(STORAGE_KEY);
    },

    async sendMessage(userMessage: string, history: ChatMessage[]): Promise<string> {
        try {
            const mappedHistory = history.map((msg) => ({
                role: msg.role === "model" ? "assistant" : "user",
                content: msg.text,
            }));

            const response = await api.post('/ai/general-chat', {
                question: userMessage,
                history: mappedHistory
            }) as { answer?: string };

            return response.answer || "No response generated.";
        } catch (error: unknown) {
            console.error("[Chat] API error:", error);
            return "Sorry, I couldn't process that. Please try again! 🔄";
        }
    },
};

