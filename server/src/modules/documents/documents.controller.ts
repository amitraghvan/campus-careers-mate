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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    // ── Learning Stats (MUST be before :id routes) ─
    @Get('stats/learning')
    async learningStats(@Req() req: any) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
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
    async upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        if (!file) throw new BadRequestException('No file provided');
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        return this.documentsService.uploadDocument(userId, file);
    }

    // ── Flashcard Toggle (no :id prefix) ───────────
    @Patch('flashcards/:flashcardId/favorite')
    async toggleFavorite(
        @Param('flashcardId') flashcardId: string,
        @Req() req: any,
    ) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        return this.documentsService.toggleFavorite(flashcardId, userId);
    }

    // ── Document List ──────────────────────────────
    @Get()
    async list(@Req() req: any) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        return this.documentsService.listDocuments(userId);
    }

    // ── Document by ID ─────────────────────────────
    @Get(':id')
    async getOne(@Param('id') id: string, @Req() req: any) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        return this.documentsService.getDocument(id, userId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: any) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        return this.documentsService.deleteDocument(id, userId);
    }

    // ── Flashcards (by doc Id) ─────────────────────
    @Get(':id/flashcards')
    async getFlashcards(@Param('id') documentId: string, @Req() req: any) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        return this.documentsService.getFlashcards(documentId, userId);
    }

    // ── Quiz Results ───────────────────────────────
    @Post(':id/quiz-results')
    async saveQuizResult(
        @Param('id') documentId: string,
        @Body() body: { questions: any; score: number; totalQuestions: number },
        @Req() req: any,
    ) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        return this.documentsService.saveQuizResult(documentId, userId, body);
    }

    @Get(':id/quiz-results')
    async getQuizResults(@Param('id') documentId: string, @Req() req: any) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        return this.documentsService.getQuizResults(documentId, userId);
    }
}
