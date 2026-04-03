/**
 * AI Controller — REST endpoints for AI document features.
 *
 * Security:
 *  - ALL endpoints require authentication (JWT) — no @Public() decorators
 *  - Per-endpoint Throttle limits prevent AI API abuse / cost attacks
 *  - Input is validated via DTOs at the pipe level
 */

import {
    Controller, Post, Body, Req, UseGuards,
    ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsArray, IsOptional, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { AiService } from './ai.service';
import { DocumentsService } from '../documents/documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

class ChatDto {
    @IsString() @IsNotEmpty() documentId!: string;
    @IsString() @IsNotEmpty() @MaxLength(2000) question!: string;
    @IsOptional() @IsArray() history?: { role: string; content: string }[];
}

class GeneralChatDto {
    @IsString() @IsNotEmpty() @MaxLength(2000) question!: string;
    @IsOptional() @IsArray() history?: { role: string; content: string }[];
}

class DocumentIdDto {
    @IsString() @IsNotEmpty() documentId!: string;
}

class ExplainDto {
    @IsString() @IsNotEmpty() documentId!: string;
    @IsString() @IsNotEmpty() @MaxLength(500) topic!: string;
}

class StudyPlanDto {
    @IsString() @IsNotEmpty() @MaxLength(500) goal!: string;
    @IsArray() subjects!: string[];
    @IsString() @IsNotEmpty() examDate!: string;
    @IsNumber() @Min(1) @Max(12) dailyHours!: number;
    @IsString() @IsIn(['beginner', 'intermediate', 'advanced']) level!: string;
}

class EnhanceBulletsDto {
    @IsString() @IsNotEmpty() @MaxLength(100) section!: string;
    @IsArray() bullets!: string[];
}

class ResumeSummaryDto {
    @IsNotEmpty() resumeData: any;
}

class AtsScoreDto {
    @IsNotEmpty() resumeData: any;
    @IsOptional() @IsString() @MaxLength(5000) jobDescription?: string;
}

class HomeworkDto {
    @IsString() @IsNotEmpty() @MaxLength(5000) question!: string;
}

class HomeworkFollowUpDto {
    @IsString() @IsNotEmpty() @MaxLength(5000) originalQuestion!: string;
    @IsString() @IsNotEmpty() @MaxLength(10000) previousSolution!: string;
    @IsString() @IsNotEmpty() @MaxLength(2000) followUp!: string;
}

class CodeExplainerDto {
    @IsString() @IsNotEmpty() @MaxLength(100) language!: string;
    @IsString() @IsNotEmpty() @MaxLength(10000) code!: string;
}

class MockExamDto {
    @IsString() @IsNotEmpty() @MaxLength(100) subject!: string;
    @IsString() @IsNotEmpty() @MaxLength(200) topic!: string;
    @IsString() @IsIn(['Easy', 'Medium', 'Hard']) difficulty!: string;
    @IsNumber() @Min(1) @Max(20) @Type(() => Number) questionCount!: number;
    @IsOptional() @IsString() @MaxLength(15000) uploadedContent?: string;
}

// ─── Controller ───────────────────────────────────────────────────────────────

@ApiTags('ai')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly documentsService: DocumentsService,
    ) { }

    // ── Document AI (already authenticated via document ownership) ────────────

    @Post('chat')
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @ApiOperation({ summary: 'Chat with a document using AI' })
    async chat(@Body() body: ChatDto, @CurrentUser('id') userId: string) {
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const answer = await this.aiService.chatWithDocument(
            doc.extractedText,
            body.question,
            body.history || [],
        );
        return { answer };
    }

    @Post('general-chat')
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @ApiOperation({ summary: 'General AI chat for placement prep' })
    async generalChat(@Body() body: GeneralChatDto) {
        const answer = await this.aiService.generalChat(body.question, body.history);
        return { answer };
    }

    @Post('summary')
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Generate document summary' })
    async summary(@Body() body: DocumentIdDto, @CurrentUser('id') userId: string) {
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const summary = await this.aiService.generateSummary(doc.extractedText);
        return { summary };
    }

    @Post('explain')
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Explain a concept from a document' })
    async explain(@Body() body: ExplainDto, @CurrentUser('id') userId: string) {
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const explanation = await this.aiService.explainConcept(
            doc.extractedText,
            body.topic,
        );
        return { explanation };
    }

    @Post('flashcards')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'Generate flashcards from a document' })
    async flashcards(@Body() body: DocumentIdDto, @CurrentUser('id') userId: string) {
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const cards = await this.aiService.generateFlashcards(doc.extractedText);
        const saved = await this.documentsService.saveFlashcards(
            body.documentId,
            userId,
            cards,
        );
        return { flashcards: saved };
    }

    @Post('quiz')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'Generate quiz from a document' })
    async quiz(@Body() body: DocumentIdDto, @CurrentUser('id') userId: string) {
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const questions = await this.aiService.generateQuiz(doc.extractedText);
        return { questions };
    }

    // ── Study Planner ────────────────────────────────────────────────────────

    @Post('study-planner/generate')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'Generate an AI study plan (auth required)' })
    async generateStudyPlan(@Body() body: StudyPlanDto) {
        const plan = await this.aiService.generateStudyPlan(body);
        return plan;
    }

    // ── Resume AI ────────────────────────────────────────────────────────────

    @Post('resume/enhance-bullets')
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Enhance resume bullets with AI (auth required)' })
    async enhanceBullets(@Body() body: EnhanceBulletsDto) {
        const enhanced = await this.aiService.enhanceResumeBullets(
            body.section,
            body.bullets,
        );
        return { bullets: enhanced };
    }

    @Post('resume/generate-summary')
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Generate resume summary with AI (auth required)' })
    async generateResumeSummary(@Body() body: ResumeSummaryDto) {
        const summary = await this.aiService.generateResumeSummary(body.resumeData);
        return { summary };
    }

    @Post('resume/ats-score')
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Analyze ATS score for a resume (auth required)' })
    async atsScore(@Body() body: AtsScoreDto) {
        const result = await this.aiService.analyzeATSScore(
            body.resumeData,
            body.jobDescription,
        );
        return result;
    }

    // ── Homework Solver ───────────────────────────────────────────────────────

    @Post('homework-solver')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'Solve a homework problem with AI (auth required)' })
    async solveHomework(@Body() body: HomeworkDto) {
        const solution = await this.aiService.solveHomework(body.question);
        return { solution };
    }

    @Post('homework-follow-up')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'Follow-up on a homework solution (auth required)' })
    async homeworkFollowUp(@Body() body: HomeworkFollowUpDto) {
        const answer = await this.aiService.homeworkFollowUp(
            body.originalQuestion,
            body.previousSolution,
            body.followUp,
        );
        return { answer };
    }

    // ── Code Tools ────────────────────────────────────────────────────────────

    @Post('code-explainer')
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Explain code with AI (auth required)' })
    async explainCode(@Body() body: CodeExplainerDto) {
        const explanation = await this.aiService.explainCode(
            body.language,
            body.code,
        );
        return { explanation };
    }

    @Post('code-debugger')
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Debug code with AI (auth required)' })
    async debugCode(@Body() body: CodeExplainerDto) {
        const result = await this.aiService.debugCode(
            body.language,
            body.code,
        );
        return result;
    }

    // ── Mock Exam ─────────────────────────────────────────────────────────────

    @Post('mock-exam')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ApiOperation({ summary: 'Generate a mock exam with AI (auth required)' })
    async generateMockExam(@Body() body: MockExamDto) {
        const result = await this.aiService.generateMockExam(
            body.subject,
            body.topic,
            body.difficulty,
            body.questionCount,
            body.uploadedContent,
        );
        return result;
    }
}
