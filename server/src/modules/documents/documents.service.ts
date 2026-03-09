/**
 * Documents Service — handles PDF storage and text extraction.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

// pdf-parse@1.1.1 exports a plain function via CJS
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>;


@Injectable()
export class DocumentsService {
    constructor(private prisma: PrismaService) { }

    /** Strip null bytes and other Postgres-unsafe characters from extracted text */
    private sanitizeText(text: string): string {
        return text
            .replace(/\x00/g, '')           // null bytes
            .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // control chars (keep \t \n \r)
            .replace(/ +/g, ' ')            // collapse multiple spaces
            .trim();
    }

    async uploadDocument(userId: string, file: Express.Multer.File) {
        // Extract text from PDF buffer
        let extractedText = '';
        try {
            const pdfData = await pdfParse(file.buffer);
            extractedText = this.sanitizeText(pdfData.text || '');
        } catch (err) {
            console.warn('[Documents] Failed to extract text from PDF:', err);
        }

        // Save file to disk
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const safeFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadsDir, safeFileName);
        fs.writeFileSync(filePath, file.buffer);

        const fileUrl = `/uploads/${safeFileName}`;

        const document = await this.prisma.document.create({
            data: {
                userId,
                fileName: file.originalname,
                fileUrl,
                fileSize: file.size,
                extractedText,
            },
        });

        return document;
    }

    async listDocuments(userId: string) {
        return this.prisma.document.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                fileName: true,
                fileUrl: true,
                fileSize: true,
                createdAt: true,
            },
        });
    }

    async getDocument(id: string, userId: string) {
        const doc = await this.prisma.document.findFirst({
            where: { id, userId },
        });
        if (!doc) throw new NotFoundException('Document not found');

        // If text wasn't extracted during upload (e.g. pdf-parse was broken),
        // try to extract it now from the file on disk and save back to DB.
        if (!doc.extractedText || doc.extractedText.trim() === '') {
            try {
                const filePath = path.join(process.cwd(), doc.fileUrl);
                if (fs.existsSync(filePath)) {
                    const buf = fs.readFileSync(filePath);
                    const parsed = await pdfParse(buf);
                    const text = this.sanitizeText(parsed?.text || '');
                    if (text.trim()) {
                        await this.prisma.document.update({
                            where: { id },
                            data: { extractedText: text },
                        });
                        return { ...doc, extractedText: text };
                    }
                }
            } catch (err) {
                console.warn('[Documents] On-demand PDF extraction failed:', err);
            }
        }

        return doc;
    }


    async deleteDocument(id: string, userId: string) {
        const doc = await this.getDocument(id, userId);

        // Delete file from disk
        try {
            const filePath = path.join(process.cwd(), doc.fileUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.warn('[Documents] Could not delete file from disk:', err);
        }

        await this.prisma.document.delete({ where: { id } });
        return { deleted: true };
    }

    // — Flashcards —

    async getFlashcards(documentId: string, userId: string) {
        return this.prisma.flashcard.findMany({
            where: { documentId, userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async saveFlashcards(
        documentId: string,
        userId: string,
        cards: { question: string; answer: string }[],
    ) {
        const data = cards.map((c) => ({
            documentId,
            userId,
            question: c.question,
            answer: c.answer,
        }));
        await this.prisma.flashcard.createMany({ data });
        return this.getFlashcards(documentId, userId);
    }

    async toggleFavorite(flashcardId: string, userId: string) {
        const card = await this.prisma.flashcard.findFirst({
            where: { id: flashcardId, userId },
        });
        if (!card) throw new NotFoundException('Flashcard not found');

        return this.prisma.flashcard.update({
            where: { id: flashcardId },
            data: { isFavorite: !card.isFavorite },
        });
    }

    // — Quiz Results —

    async saveQuizResult(
        documentId: string,
        userId: string,
        data: { questions: any; score: number; totalQuestions: number },
    ) {
        return this.prisma.quizResult.create({
            data: {
                documentId,
                userId,
                questions: data.questions,
                score: data.score,
                totalQuestions: data.totalQuestions,
            },
        });
    }

    async getQuizResults(documentId: string, userId: string) {
        return this.prisma.quizResult.findMany({
            where: { documentId, userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    // — Learning Stats —

    async getLearningStats(userId: string) {
        const [totalDocuments, totalFlashcards, totalQuizzes, quizResults] =
            await Promise.all([
                this.prisma.document.count({ where: { userId } }),
                this.prisma.flashcard.count({ where: { userId } }),
                this.prisma.quizResult.count({ where: { userId } }),
                this.prisma.quizResult.findMany({
                    where: { userId },
                    select: { score: true, totalQuestions: true },
                }),
            ]);

        const averageScore =
            quizResults.length > 0
                ? Math.round(
                    quizResults.reduce(
                        (sum, q) => sum + (q.score / q.totalQuestions) * 100,
                        0,
                    ) / quizResults.length,
                )
                : 0;

        return {
            totalDocuments,
            totalFlashcards,
            totalQuizzes,
            averageScore,
        };
    }
}
