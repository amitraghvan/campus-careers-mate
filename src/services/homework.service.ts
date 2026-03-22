/**
 * Homework Solver Service — Groq AI integration (runs directly in the browser).
 * Uses VITE_GROQ_API_KEY so it works without a backend server.
 */

import Groq from 'groq-sdk';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

function getGroq() {
    return new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
}

async function complete(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!API_KEY) return '⚠️ Groq API key is not configured. Please set VITE_GROQ_API_KEY.';
    const groq = getGroq();
    const response = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 2048,
    });
    return response.choices[0]?.message?.content || 'No response generated.';
}

export const homeworkService = {
    async solve(question: string): Promise<string> {
        return complete(
            `You are an expert tutor with deep knowledge in mathematics, science, programming, and all academic subjects.
When solving a problem:
1. Break it into clear, numbered steps.
2. Explain the reasoning behind each step.
3. Use simple language — assume the student is learning.
4. At the very end, clearly state: "✅ Final Answer: <answer>"
5. For coding questions, include commented code examples.
6. For math, show all working clearly.
Keep it structured and easy to follow.`,
            `Solve this problem step by step:\n\n${question}`,
        );
    },

    async followUp(
        originalQuestion: string,
        previousSolution: string,
        followUp: string,
    ): Promise<string> {
        return complete(
            `You are an expert tutor. The student already received a solution and is asking a follow-up question. Be concise, helpful, and refer back to the previous solution where relevant.`,
            `Original question:\n${originalQuestion}\n\nPrevious solution:\n${previousSolution}\n\nFollow-up question:\n${followUp}`,
        );
    },
};
