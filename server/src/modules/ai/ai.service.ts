/**
 * AI Service — Groq LLaMA integration for document intelligence.
 * Runs server-side so the API key stays private.
 *
 * Security:
 *  - All user-supplied free-text is sanitized by sanitizeInput() before
 *    being embedded in AI prompts. This prevents prompt-injection attacks
 *    where an attacker crafts input like "Ignore previous instructions…"
 *    to hijack the model's behaviour or exfiltrate data.
 */

import { Injectable, BadRequestException } from '@nestjs/common';
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

    /**
     * Sanitizes user-supplied free-text before it is embedded into AI prompts.
     *
     * Protections applied:
     *  1. Strip null bytes and dangerous control characters.
     *  2. Enforce a hard length ceiling (defaults to 10,000 chars).
     *  3. Detect and reject known prompt-injection patterns.
     *
     * @throws BadRequestException when the input is unsafe.
     */
    private sanitizeInput(value: string, maxLength = 10_000): string {
        if (typeof value !== 'string') {
            throw new BadRequestException('Invalid input: expected a string.');
        }

        // 1. Strip null bytes and non-printable control characters
        //    (keep \t, \n, \r which are legitimate in code / essay questions)
        const cleaned = value
            .replace(/\x00/g, '')
            .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            .trim();

        // 2. Hard length ceiling
        if (cleaned.length > maxLength) {
            throw new BadRequestException(
                `Input too long. Maximum allowed is ${maxLength} characters.`,
            );
        }

        // 3. Prompt-injection pattern detection
        //    These phrases are commonly used to override system prompts.
        const injectionPatterns: RegExp[] = [
            /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
            /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
            /forget\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
            /you\s+are\s+now\s+(a|an)?/i,
            /act\s+as\s+(a|an)?\s+[a-z]+/i,
            /system\s*prompt/i,
            /reveal\s+(your\s+)?(system|hidden|secret|internal)\s+(prompt|instructions?)/i,
            /print\s+(your\s+)?(system|hidden|secret|internal)\s+(prompt|instructions?)/i,
            /output\s+(all\s+)?(env(ironment)?\s+)?(variables?|secrets?|keys?)/i,
            /((list|show|dump)\s+)?(all\s+)?environment\s+variables?/i,
            /jailbreak/i,
            /DAN\s+mode/i,
            /developer\s+mode\s+(enabled?|on)/i,
            /bypass\s+(all\s+)?(safety|content|filter)/i,
            /override\s+(all\s+)?(previous|prior|above)\s+(instructions?|guidelines?|rules?)/i,
        ];

        for (const pattern of injectionPatterns) {
            if (pattern.test(cleaned)) {
                throw new BadRequestException(
                    'Invalid input: potentially unsafe content detected.',
                );
            }
        }

        return cleaned;
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
        const safeQuestion = this.sanitizeInput(question, 2000);
        const systemPrompt = `You are a helpful study assistant. Answer questions using ONLY the following document context. If the answer is not in the document, say so clearly.\n\n--- DOCUMENT ---\n${extractedText.slice(0, 12000)}\n--- END ---`;

        const messages: any[] = [
            { role: 'system', content: systemPrompt },
            ...history.map((h) => ({
                role: h.role === 'model' ? 'assistant' : h.role,
                content: h.content,
            })),
            { role: 'user', content: safeQuestion },
        ];

        const response = await this.groq.chat.completions.create({
            messages,
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1024,
        });

        return response.choices[0]?.message?.content || 'No response generated.';
    }

    async generalChat(
        question: string,
        history: { role: string; content: string }[] = [],
    ): Promise<string> {
        const safeQuestion = this.sanitizeInput(question, 2000);
        const systemPrompt = `You are PlaceTrack AI — a friendly, helpful placement preparation assistant for Indian college students.

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

        const messages: any[] = [
            { role: 'system', content: systemPrompt },
            ...history.map((h) => ({
                role: h.role === 'model' ? 'assistant' : h.role,
                content: h.content,
            })),
            { role: 'user', content: safeQuestion },
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
        const safeTopic = this.sanitizeInput(topic, 500);
        return this.complete(
            'You are a patient, thorough teacher. Explain concepts from the document in detail with examples.',
            `From this document:\n\n${extractedText.slice(0, 12000)}\n\nExplain the concept of: "${safeTopic}"`,
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

    // ── AI Study Planner ─────────────────────────────────────────────

    async generateStudyPlan(input: any): Promise<any> {
        const { goal, subjects, examDate, dailyHours, level } = input;
        
        const systemPrompt = `You are an expert AI Study Planner.
Generate a comprehensive, day-by-day schedule based on the user's goals.
You MUST return ONLY a valid JSON object matching the exact schema provided. Do not wrap in markdown or explain.

Schema:
{
  "dailyPlan": [
    {
      "day": number,
      "date": "MMM do, yyyy",
      "topics": [{ "taskId": "string", "title": "string", "completed": false }],
      "hours": number
    }
  ],
  "weeklyGoals": ["string"],
  "focusAreas": ["string"]
}

Guidelines:
- Create a realistic plan leading up to: ${examDate}
- Limit daily hours to: ${dailyHours}
- Skill level: ${level}
- Target Goal: ${goal}
- Subjects: ${subjects.join(", ")}
- Ensure every topic has a unique \`taskId\` (e.g., "day1-topic1").
- Start dates from tomorrow. Keep the plan to max 14 days to prevent overly large returns.`;

        const response = await this.groq.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 3000,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("Failed to generate plan.");

        try {
            return JSON.parse(content);
        } catch (e) {
            throw new Error("AI returned invalid JSON.");
        }
    }

    // ── Resume AI Methods ──────────────────────────────────────────

    async enhanceResumeBullets(section: string, bullets: string[]): Promise<string[]> {
        const result = await this.complete(
            `You are a professional resume writer with 15 years of experience at top tech companies (Google, Amazon, Microsoft).
Rewrite the provided resume bullet points to:
1. Start with strong action verbs (Led, Architected, Optimized, Delivered, Reduced, Increased, Built, Designed, Shipped, Automated)
2. Include quantifiable metrics wherever possible (%, numbers, timeframes, scale)
3. Follow the STAR method (compressed): Action + Tool/Method + Result
4. Use industry-standard technical terminology relevant to ${section}
5. Be concise (max 15 words per bullet)
6. Make each bullet unique and impactful

Return ONLY a valid JSON array of enhanced bullet point strings. No markdown, no explanation, just JSON array.`,
            `Enhance these resume bullets for the "${section}" section:\n${JSON.stringify(bullets)}`,
        );

        try {
            const jsonMatch = result.match(/\[[\s\S]*\]/);
            if (jsonMatch) return JSON.parse(jsonMatch[0]);
            return JSON.parse(result);
        } catch {
            return bullets;
        }
    }

    async generateResumeSummary(resumeData: any): Promise<string> {
        const context = JSON.stringify({
            name: resumeData.personalInfo?.name,
            targetRole: resumeData.personalInfo?.targetRole,
            skills: resumeData.skills,
            experience: resumeData.experience?.map((e: any) => `${e.role} at ${e.company}`),
            projects: resumeData.projects?.map((p: any) => p.title),
        });

        return this.complete(
            `You are an elite resume coach and career strategist. Write a compelling 3-sentence professional summary that:
1. Opens with a strong professional identity statement mentioning years/level of experience and primary domain
2. Highlights 2-3 key technical strengths with specifics relevant to the target role
3. States a clear career goal and what value the candidate brings
Make it compelling, keyword-rich, ATS-optimized, and human-sounding. Max 70 words. No buzzword fluff.
Return ONLY the summary text, no quotes or extra formatting.`,
            `Write a professional summary for this candidate:\n${context}`,
        );
    }

    async analyzeATSScore(resumeData: any, jobDescription?: string): Promise<{
        score: number;
        breakdown: { keywords: number; formatting: number; experience: number; skills: number };
        strengths: string[];
        improvements: string[];
        missingKeywords: string[];
        verdict: string;
    }> {
        const resumeStr = JSON.stringify(resumeData, null, 2);
        const jobCtx = jobDescription ? `\n\nTarget Job Description:\n${jobDescription.slice(0, 1000)}` : '';

        const result = await this.complete(
            `You are a professional ATS (Applicant Tracking System) expert and senior technical recruiter at a top tech company.
Analyze the provided resume and return a JSON object with EXACTLY this structure:
{
  "score": <integer 0-100>,
  "breakdown": {
    "keywords": <integer 0-25, score for action verbs, tech keywords, industry terms>,
    "formatting": <integer 0-25, score for structure clarity, sections, dates, quantified achievements>,
    "experience": <integer 0-25, score for relevance and quality of experience/projects>,
    "skills": <integer 0-25, score for technical + soft skills completeness>
  },
  "strengths": [<3 specific strength strings>],
  "improvements": [<5 specific, actionable improvement strings>],
  "missingKeywords": [<5-8 important missing keywords for tech roles>],
  "verdict": <"Excellent" | "Good" | "Needs Work" | "Poor">
}

Scoring guide:
- keywords (0-25): Action verbs, tech stack mentions, domain-specific terms, industry buzzwords
- formatting (0-25): Clear section headers, date formats, bullet points, quantified results (numbers/%)
- experience (0-25): Relevance, career progression, impact shown, project quality
- skills (0-25): Tech skills completeness, right tools for role, soft skills presence

Be STRICT and REALISTIC. Most resumes score 40-70. Only truly exceptional resumes score 85+.
Return ONLY valid JSON, no markdown, no explanation.`,
            `Analyze this resume for ATS compatibility:${resumeStr}${jobCtx}`,
        );

        try {
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) return JSON.parse(jsonMatch[0]);
            return JSON.parse(result);
        } catch {
            return {
                score: 0,
                breakdown: { keywords: 0, formatting: 0, experience: 0, skills: 0 },
                strengths: ['Could not analyze'],
                improvements: ['Please try again'],
                missingKeywords: [],
                verdict: 'Poor',
            };
        }
    }

    // ── Homework Solver ────────────────────────────────────────────

    async solveHomework(question: string): Promise<string> {
        const safeQuestion = this.sanitizeInput(question, 5000);
        return this.complete(
            `You are an expert tutor with deep knowledge in mathematics, science, programming, and all academic subjects.
When solving a problem:
1. Break it into clear, numbered steps.
2. Explain the reasoning behind each step.
3. Use simple language — assume the student is learning.
4. At the very end, clearly state: "✅ Final Answer: <answer>"
5. For coding questions, include commented code examples.
6. For math, show all working clearly.
Keep it structured and easy to follow.`,
            `Solve this problem step by step:\n\n${safeQuestion}`,
        );
    }

    async homeworkFollowUp(
        originalQuestion: string,
        previousSolution: string,
        followUp: string,
    ): Promise<string> {
        const safeOriginal  = this.sanitizeInput(originalQuestion, 5000);
        const safeSolution  = this.sanitizeInput(previousSolution, 10000);
        const safeFollowUp  = this.sanitizeInput(followUp, 2000);
        const systemPrompt = `You are an expert tutor. The student already received a solution and is asking a follow-up question. Be concise, helpful, and refer back to the previous solution where relevant.`;
        const userPrompt = `Original question:\n${safeOriginal}\n\nPrevious solution:\n${safeSolution}\n\nFollow-up question:\n${safeFollowUp}`;
        return this.complete(systemPrompt, userPrompt);
    }

    // ── Code Explainer & Debugger ──────────────────────────────────

    async explainCode(language: string, code: string): Promise<string> {
        const safeLang = this.sanitizeInput(language, 100);
        const safeCode = this.sanitizeInput(code, 10000);
        return this.complete(
            `You are an expert programming teacher. 
When explaining code:
1. Break down what the code does step by step.
2. Use simple, clear language.
3. If relevant, explain the time/space complexity.
4. Keep the tone encouraging and academic.`,
            `Explain this ${safeLang} code step by step:\n\n\`\`\`${safeLang}\n${safeCode}\n\`\`\``,
        );
    }

    async debugCode(language: string, code: string): Promise<{ error: string; fixed_code: string }> {
        const safeLang = this.sanitizeInput(language, 100);
        const safeCode = this.sanitizeInput(code, 10000);
        const result = await this.complete(
            `You are an expert programming debugger.
Identify the error(s) in the provided code and fix it.
Return ONLY a valid JSON object with exactly these two keys:
{
  "error": "<description of what was wrong>",
  "fixed_code": "<the fully corrected code snippet without any markdown formatting around it>"
}
No other text. Just the JSON.`,
            `Debug this ${safeLang} code:\n\n\`\`\`${safeLang}\n${safeCode}\n\`\`\``,
        );

        try {
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) return JSON.parse(jsonMatch[0]);
            return JSON.parse(result);
        } catch {
            return {
                error: 'Could not automatically debug this code. The error description or code might be too complex for the current model.',
                fixed_code: code,
            };
        }
    }

    // ── Mock Exams ──────────────────────────────────────────────────

    async generateMockExam(
        subject: string,
        topic: string,
        difficulty: string,
        questionCount: number,
        uploadedContent?: string,
    ): Promise<any> {
        const systemPrompt = `You are an expert educational content creator.
Generate a mock exam based on the user's request.
Return ONLY a valid JSON object in the exact following format, with NO extra markdown formatting or text outside the JSON:
{
  "questions": [
    {
      "question": "What is...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Because..."
    }
  ]
}`;

        const safeSubject    = this.sanitizeInput(subject, 100);
        const safeTopic      = this.sanitizeInput(topic, 200);
        const safeContent    = uploadedContent ? this.sanitizeInput(uploadedContent, 15000) : undefined;

        const contextPart = safeContent
            ? `\n\nReference Material:\n${safeContent}`
            : '';

        const userPrompt = `Generate a mock exam for the subject: ${safeSubject}.
Topic: ${safeTopic}.
Difficulty level: ${difficulty}.
Number of questions: ${questionCount}.${contextPart}

Create multiple-choice questions with 4 options each.
Include the correct answer and a short explanation for each question.`;

        const result = await this.complete(systemPrompt, userPrompt);

        try {
            // Try to extract JSON if it was wrapped in markdown blocks
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) return JSON.parse(jsonMatch[0]);
            return JSON.parse(result);
        } catch (error) {
            console.error(`Failed to parse AI mock exam response: ${result}`, error);
            throw new Error('Failed to generate mock exam in the correct format.');
        }
    }
}
