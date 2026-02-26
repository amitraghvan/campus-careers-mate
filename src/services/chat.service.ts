/**
 * Chat Service — Gemini AI integration for PlaceTrack.
 * Calls the Google Generative AI SDK directly from the frontend.
 */

import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

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
            return "⚠️ Groq API key is not configured. Please set VITE_GROQ_API_KEY in your environment.";
        }

        try {
            const groq = new Groq({
                apiKey: API_KEY,
                dangerouslyAllowBrowser: true // Required for frontend usage
            });

            // Build conversation messages array
            const messages = [
                { role: "system", content: SYSTEM_PROMPT },
                ...history.map((msg) => ({
                    role: msg.role === "model" ? "assistant" : "user",
                    content: msg.text,
                })),
                { role: "user", content: userMessage }
            ];

            const response = await groq.chat.completions.create({
                messages: messages as any,
                model: "llama-3.1-8b-instant", // Ensure we use an actively supported Groq model
                temperature: 0.7,
                max_tokens: 1024,
            });

            return response.choices[0]?.message?.content || "No response generated.";
        } catch (error: unknown) {
            console.error("[Chat] Groq API error:", error);

            const message = error instanceof Error ? error.message : "";
            if (message.includes("API key") || message.includes("401")) {
                return "⚠️ Invalid API key. Please check your VITE_GROQ_API_KEY.";
            }
            if (message.includes("rate limit") || message.includes("429")) {
                return "⚠️ API quota exceeded or rate limited. Please try again later.";
            }
            return "Sorry, I couldn't process that. Please try again! 🔄";
        }
    },
};

