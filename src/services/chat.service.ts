/**
 * Chat Service — Gemini AI integration for PlaceTrack.
 * Calls the Google Generative AI SDK directly from the frontend.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are PlaceTrack AI — a friendly, helpful placement preparation assistant for Indian college students.

Your expertise:
- Campus placement strategies and timelines
- Interview preparation (HR, technical, case studies)
- Resume and cover letter tips
- DSA and coding interview preparation
- Company-specific interview insights (FAANG, startups, service companies)
- Salary negotiation and offer evaluation
- Soft skills and communication tips
- Aptitude and reasoning test preparation

Rules:
- Be concise but helpful. Use bullet points when listing things.
- Use encouraging language — placement season is stressful!
- If asked about non-placement topics, politely redirect.
- Use examples relevant to Indian campus placements.
- Reply in the same language the user writes in (Hindi, English, Hinglish, etc.)
- Keep responses under 300 words unless specifically asked for detail.
- Use emojis sparingly to keep things friendly 🎯`;

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
        if (!API_KEY) {
            return "⚠️ Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.";
        }

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            // Build conversation history for context
            const chatHistory = history.map((msg) => ({
                role: msg.role as "user" | "model",
                parts: [{ text: msg.text }],
            }));

            const chat = model.startChat({
                history: chatHistory,
                generationConfig: {
                    maxOutputTokens: 1024,
                    temperature: 0.7,
                },
            });

            // Send with system context
            const prompt = history.length === 0
                ? `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`
                : userMessage;

            const result = await chat.sendMessage(prompt);
            const response = result.response;
            return response.text();
        } catch (error: any) {
            console.error("[Chat] Gemini API error:", error);

            if (error?.message?.includes("API_KEY")) {
                return "⚠️ Invalid API key. Please check your VITE_GEMINI_API_KEY.";
            }
            if (error?.message?.includes("quota")) {
                return "⚠️ API quota exceeded. Please try again later.";
            }
            return "Sorry, I couldn't process that. Please try again! 🔄";
        }
    },
};

