/**
 * Resume Service — API calls for AI Resume Builder.
 */

import { api } from '@/lib/api';

export interface ResumeData {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
        github: string;
        website: string;
        targetRole: string;
    };
    summary: string;
    experience: {
        id: string;
        company: string;
        role: string;
        startDate: string;
        endDate: string;
        current: boolean;
        bullets: string[];
    }[];
    education: {
        id: string;
        institution: string;
        degree: string;
        field: string;
        year: string;
        cgpa: string;
    }[];
    skills: {
        languages: string[];
        frameworks: string[];
        tools: string[];
        soft: string[];
    };
    projects: {
        id: string;
        title: string;
        techStack: string;
        description: string;
        link: string;
    }[];
    certifications: {
        id: string;
        name: string;
        issuer: string;
        date: string;
        url: string;
    }[];
    achievements: string[];
    theme?: {
        fontFamily: string;
        fontSize: number;
        color: string;
    };
}

export interface ResumeMeta {
    id: string;
    title: string;
    atsScore: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface ATSResult {
    score: number;
    breakdown: { keywords: number; formatting: number; experience: number; skills: number };
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
    verdict: string;
}

export const resumeService = {
    async listResumes(): Promise<ResumeMeta[]> {
        return api.get<ResumeMeta[]>('/resume');
    },

    async getResume(id: string): Promise<{ id: string; title: string; data: ResumeData; atsScore: number | null; atsFeedback: ATSResult | null }> {
        return api.get<{ id: string; title: string; data: ResumeData; atsScore: number | null; atsFeedback: ATSResult | null }>(`/resume/${id}`);
    },

    async createResume(title: string, data: ResumeData): Promise<{ id: string }> {
        return api.post<{ id: string }>('/resume', { title, data });
    },

    async updateResume(id: string, payload: { title?: string; data?: ResumeData; atsScore?: number; atsFeedback?: ATSResult }) {
        return api.patch(`/resume/${id}`, payload);
    },

    async deleteResume(id: string) {
        return api.delete(`/resume/${id}`);
    },

    async enhanceBullets(section: string, bullets: string[]): Promise<string[]> {
        const data = await api.post<{ bullets: string[] }>('/ai/resume/enhance-bullets', { section, bullets });
        return data.bullets;
    },

    async generateSummary(resumeData: ResumeData): Promise<string> {
        const data = await api.post<{ summary: string }>('/ai/resume/generate-summary', { resumeData });
        return data.summary;
    },

    async analyzeATS(resumeData: ResumeData, jobDescription?: string): Promise<ATSResult> {
        return api.post<ATSResult>('/ai/resume/ats-score', { resumeData, jobDescription });
    },
};
