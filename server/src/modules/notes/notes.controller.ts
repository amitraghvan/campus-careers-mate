/**
 * Notes Controller
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { NotesService } from "./notes.service";
import { CreateNoteDto, UpdateNoteDto } from "./dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("notes")
@ApiBearerAuth()
@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: "List all notes" })
  async findAll(@CurrentUser("id") userId: string) {
    return this.notesService.findAll(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get note by ID" })
  async findOne(
    @CurrentUser("id") userId: string,
    @Param("id") id: string,
  ) {
    return this.notesService.findOne(userId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new note" })
  async create(
    @CurrentUser("id") userId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(userId, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a note" })
  async update(
    @CurrentUser("id") userId: string,
    @Param("id") id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(userId, id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a note" })
  async remove(
    @CurrentUser("id") userId: string,
    @Param("id") id: string,
  ) {
    return this.notesService.remove(userId, id);
  }

  @Patch(":id/pin")
  @ApiOperation({ summary: "Toggle note pin status" })
  async togglePin(
    @CurrentUser("id") userId: string,
    @Param("id") id: string,
  ) {
    return this.notesService.togglePin(userId, id);
  }
}

