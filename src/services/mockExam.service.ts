/**
 * Mock Exam Service — Frontend API calls for AI Mock Exams.
 */

import { api } from '@/lib/api';

export interface MockExamQuestion {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

export interface MockExamResponse {
    questions: MockExamQuestion[];
}

export const mockExamService = {
    async generateMockExam(data: {
        subject: string;
        topic: string;
        difficulty: string;
        questionCount: number;
        uploadedContent?: string;
    }): Promise<MockExamResponse> {
        const res = await api.post<MockExamResponse>('/ai/mock-exam', data);
        return res;
    },
};
