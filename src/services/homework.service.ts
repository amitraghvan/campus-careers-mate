/**
 * Homework Solver Service — routes through the deployed backend API.
 * Backend: https://campus-careers-mate.onrender.com
 */

import { api } from '@/lib/api';

export const homeworkService = {
    async solve(question: string): Promise<string> {
        const res = await api.post<{ solution: string }>('/ai/homework-solver', { question });
        return res.solution;
    },

    async followUp(
        originalQuestion: string,
        previousSolution: string,
        followUp: string,
    ): Promise<string> {
        const res = await api.post<{ answer: string }>('/ai/homework-follow-up', {
            originalQuestion,
            previousSolution,
            followUp,
        });
        return res.answer;
    },
};
