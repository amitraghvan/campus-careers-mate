/**
 * Resume Controller — REST endpoints for Resume Builder.
 */

import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('resume')
@UseGuards(JwtAuthGuard)
export class ResumeController {
    constructor(private readonly resumeService: ResumeService) { }

    @Get()
    list(@Req() req: any) {
        const userId = req.user?.id || req.user?.sub;
        return this.resumeService.listResumes(userId);
    }

    @Post()
    create(@Req() req: any, @Body() body: { title?: string; data?: any }) {
        const userId = req.user?.id || req.user?.sub;
        return this.resumeService.createResume(userId, body.title || 'My Resume', body.data || {});
    }

    @Get(':id')
    getOne(@Param('id') id: string, @Req() req: any) {
        const userId = req.user?.id || req.user?.sub;
        return this.resumeService.getResume(id, userId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Req() req: any,
        @Body() body: { title?: string; data?: any; atsScore?: number; atsFeedback?: any },
    ) {
        const userId = req.user?.id || req.user?.sub;
        return this.resumeService.updateResume(id, userId, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        const userId = req.user?.id || req.user?.sub;
        return this.resumeService.deleteResume(id, userId);
    }
}
