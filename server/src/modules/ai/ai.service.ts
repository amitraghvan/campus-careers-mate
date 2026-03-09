/**
 * AI Service — Groq LLaMA integration for document intelligence.
 * Runs server-side so the API key stays private.
 */

import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
    private groq: Groq;

    constructor(private config: ConfigService) {
        this.groq = new Groq({
            apiKey: this.config.get<string>('GROQ_API_KEY', ''),
        });
    }

    private async complete(systemPrompt: string, userPrompt: string): Promise<string> {
        const response = await this.groq.chat.completions.create({
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

    async chatWithDocument(
        extractedText: string,
        question: string,
        history: { role: string; content: string }[] = [],
    ): Promise<string> {
        const systemPrompt = `You are a helpful study assistant. Answer questions using ONLY the following document context. If the answer is not in the document, say so clearly.\n\n--- DOCUMENT ---\n${extractedText.slice(0, 12000)}\n--- END ---`;

        const messages: any[] = [
            { role: 'system', content: systemPrompt },
            ...history.map((h) => ({
                role: h.role === 'model' ? 'assistant' : h.role,
                content: h.content,
            })),
            { role: 'user', content: question },
        ];

        const response = await this.groq.chat.completions.create({
            messages,
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1024,
        });

        return response.choices[0]?.message?.content || 'No response generated.';
    }

    async generateSummary(extractedText: string): Promise<string> {
        return this.complete(
            'You are an expert summarizer. Summarize documents clearly using bullet points. Be concise but thorough.',
            `Summarize the following document:\n\n${extractedText.slice(0, 12000)}`,
        );
    }

    async explainConcept(extractedText: string, topic: string): Promise<string> {
        return this.complete(
            'You are a patient, thorough teacher. Explain concepts from the document in detail with examples.',
            `From this document:\n\n${extractedText.slice(0, 12000)}\n\nExplain the concept of: "${topic}"`,
        );
    }

    async generateFlashcards(extractedText: string): Promise<{ question: string; answer: string }[]> {
        const result = await this.complete(
            'You generate study flashcards. Return ONLY a valid JSON array of objects with "question" and "answer" keys. No markdown, no explanation, just JSON.',
            `Create 8 study flashcards from the following document:\n\n${extractedText.slice(0, 12000)}`,
        );

        try {
            // Try to extract JSON from the response
            const jsonMatch = result.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(result);
        } catch {
            return [{ question: 'Error', answer: 'Could not generate flashcards. Please try again.' }];
        }
    }

    async generateQuiz(
        extractedText: string,
    ): Promise<{ question: string; options: string[]; correctAnswer: string }[]> {
        const result = await this.complete(
            'You generate multiple-choice quizzes. Return ONLY a valid JSON array of objects with "question" (string), "options" (array of 4 strings), and "correctAnswer" (string matching one of the options). No markdown, no explanation, just JSON.',
            `Create 5 multiple-choice quiz questions from this document:\n\n${extractedText.slice(0, 12000)}`,
        );

        try {
            const jsonMatch = result.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(result);
        } catch {
            return [
                {
                    question: 'Could not generate quiz. Please try again.',
                    options: ['A', 'B', 'C', 'D'],
                    correctAnswer: 'A',
                },
            ];
        }
    }
}
