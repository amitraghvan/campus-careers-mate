/**
 * Documents Controller — REST endpoints for document management.
 */

import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Req,
    Patch,
    Body,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    // ── Learning Stats (MUST be before :id routes) ─
    @Get('stats/learning')
    async learningStats(@CurrentUser('id') userId: string) {
        return this.documentsService.getLearningStats(userId);
    }

    // ── Upload ─────────────────────────────────────
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
            fileFilter: (_req, file, cb) => {
                if (file.mimetype !== 'application/pdf') {
                    cb(new BadRequestException('Only PDF files are allowed'), false);
                } else {
                    cb(null, true);
                }
            },
        }),
    )
    async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser('id') userId: string) {
        if (!file) throw new BadRequestException('No file provided');
        return this.documentsService.uploadDocument(userId, file);
    }

    // ── Flashcard Toggle (no :id prefix) ───────────
    @Patch('flashcards/:flashcardId/favorite')
    async toggleFavorite(
        @Param('flashcardId') flashcardId: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.documentsService.toggleFavorite(flashcardId, userId);
    }

    // ── Document List ──────────────────────────────
    @Get()
    async list(@CurrentUser('id') userId: string) {
        return this.documentsService.listDocuments(userId);
    }

    // ── Document by ID ─────────────────────────────
    @Get(':id')
    async getOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.documentsService.getDocument(id, userId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.documentsService.deleteDocument(id, userId);
    }

    // ── Flashcards (by doc Id) ─────────────────────
    @Get(':id/flashcards')
    async getFlashcards(@Param('id') documentId: string, @CurrentUser('id') userId: string) {
        return this.documentsService.getFlashcards(documentId, userId);
    }

    // ── Quiz Results ───────────────────────────────
    @Post(':id/quiz-results')
    async saveQuizResult(
        @Param('id') documentId: string,
        @Body() body: { questions: any; score: number; totalQuestions: number },
        @CurrentUser('id') userId: string,
    ) {
        return this.documentsService.saveQuizResult(documentId, userId, body);
    }

    @Get(':id/quiz-results')
    async getQuizResults(@Param('id') documentId: string, @CurrentUser('id') userId: string) {
        return this.documentsService.getQuizResults(documentId, userId);
    }
}
