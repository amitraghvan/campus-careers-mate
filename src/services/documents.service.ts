/**
 * Documents Service — API calls for the AI Learning Module.
 */

import { api } from '@/lib/api';

export interface DocumentMeta {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    createdAt: string;
}

export interface FlashcardData {
    id: string;
    documentId: string;
    question: string;
    answer: string;
    isFavorite: boolean;
    createdAt: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface QuizResultData {
    id: string;
    documentId: string;
    score: number;
    totalQuestions: number;
    createdAt: string;
}

export interface LearningStats {
    totalDocuments: number;
    totalFlashcards: number;
    totalQuizzes: number;
    averageScore: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const documentsService = {
    // — Documents —

    async uploadDocument(file: File): Promise<DocumentMeta> {
        const formData = new FormData();
        formData.append('file', file);

        // Read JWT from localStorage (same key used by authService)
        let token = '';
        try {
            const raw = localStorage.getItem('placement-tracker-auth');
            if (raw) {
                const session = JSON.parse(raw);
                token = session?.token || session?.accessToken || '';
            }
        } catch { /* ignore */ }

        const res = await fetch(`${API_BASE}/api/v1/documents/upload`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(err.message || 'Upload failed');
        }

        const json = await res.json();
        return json.data || json;
    },

    async listDocuments(): Promise<DocumentMeta[]> {
        return api.get<DocumentMeta[]>('/documents');
    },

    async deleteDocument(id: string): Promise<void> {
        await api.delete(`/documents/${id}`);
    },

    // — AI —

    async chatWithDocument(
        documentId: string,
        question: string,
        history: { role: string; content: string }[] = [],
    ): Promise<string> {
        const res = await api.post<{ answer: string }>('/ai/chat', {
            documentId,
            question,
            history,
        });
        return res.answer;
    },

    async generateSummary(documentId: string): Promise<string> {
        const res = await api.post<{ summary: string }>('/ai/summary', {
            documentId,
        });
        return res.summary;
    },

    async explainConcept(documentId: string, topic: string): Promise<string> {
        const res = await api.post<{ explanation: string }>('/ai/explain', {
            documentId,
            topic,
        });
        return res.explanation;
    },

    // — Flashcards —

    async generateFlashcards(documentId: string): Promise<FlashcardData[]> {
        const res = await api.post<{ flashcards: FlashcardData[] }>(
            '/ai/flashcards',
            { documentId },
        );
        return res.flashcards;
    },

    async getFlashcards(documentId: string): Promise<FlashcardData[]> {
        return api.get<FlashcardData[]>(`/documents/${documentId}/flashcards`);
    },

    async toggleFavorite(flashcardId: string): Promise<FlashcardData> {
        return api.patch<FlashcardData>(
            `/documents/flashcards/${flashcardId}/favorite`,
            {},
        );
    },

    // — Quiz —

    async generateQuiz(documentId: string): Promise<QuizQuestion[]> {
        const res = await api.post<{ questions: QuizQuestion[] }>('/ai/quiz', {
            documentId,
        });
        return res.questions;
    },

    async saveQuizResult(
        documentId: string,
        data: { questions: any; score: number; totalQuestions: number },
    ): Promise<QuizResultData> {
        return api.post<QuizResultData>(
            `/documents/${documentId}/quiz-results`,
            data,
        );
    },

    async getQuizResults(documentId: string): Promise<QuizResultData[]> {
        return api.get<QuizResultData[]>(
            `/documents/${documentId}/quiz-results`,
        );
    },

    // — Stats —

    async getLearningStats(): Promise<LearningStats> {
        return api.get<LearningStats>('/documents/stats/learning');
    },
};
