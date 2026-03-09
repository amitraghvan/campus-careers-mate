/**
 * AI Controller — REST endpoints for AI document features.
 */

import { Controller, Post, Body, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { DocumentsService } from '../documents/documents.service';

@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
        private readonly documentsService: DocumentsService,
    ) { }

    @Post('chat')
    async chat(
        @Body()
        body: {
            documentId: string;
            question: string;
            history?: { role: string; content: string }[];
        },
        @Req() req: any,
    ) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const answer = await this.aiService.chatWithDocument(
            doc.extractedText,
            body.question,
            body.history || [],
        );
        return { answer };
    }

    @Post('summary')
    async summary(@Body() body: { documentId: string }, @Req() req: any) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const summary = await this.aiService.generateSummary(doc.extractedText);
        return { summary };
    }

    @Post('explain')
    async explain(
        @Body() body: { documentId: string; topic: string },
        @Req() req: any,
    ) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const explanation = await this.aiService.explainConcept(
            doc.extractedText,
            body.topic,
        );
        return { explanation };
    }

    @Post('flashcards')
    async flashcards(@Body() body: { documentId: string }, @Req() req: any) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const cards = await this.aiService.generateFlashcards(doc.extractedText);
        // Save to database
        const saved = await this.documentsService.saveFlashcards(
            body.documentId,
            userId,
            cards,
        );
        return { flashcards: saved };
    }

    @Post('quiz')
    async quiz(@Body() body: { documentId: string }, @Req() req: any) {
        const userId = req.user?.id || req.user?.sub || 'anonymous';
        const doc = await this.documentsService.getDocument(body.documentId, userId);
        const questions = await this.aiService.generateQuiz(doc.extractedText);
        return { questions };
    }
}
