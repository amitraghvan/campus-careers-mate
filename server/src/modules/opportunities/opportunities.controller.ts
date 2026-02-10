/**
 * Opportunities Controller — RESTful routes for placement opportunities.
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { OpportunitiesService } from "./opportunities.service";
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
  UpdateStatusDto,
  CreateChecklistItemDto,
  UpdateChecklistItemDto,
  OpportunityQueryDto,
} from "./dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("opportunities")
@ApiBearerAuth()
@Controller("opportunities")
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  @Get()
  @ApiOperation({ summary: "List all opportunities (paginated)" })
  async findAll(
    @CurrentUser("id") userId: string,
    @Query() query: OpportunityQueryDto,
  ) {
    return this.service.findAll(userId, query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get opportunity by ID" })
  async findOne(
    @CurrentUser("id") userId: string,
    @Param("id") id: string,
  ) {
    return this.service.findOne(userId, id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new opportunity" })
  async create(
    @CurrentUser("id") userId: string,
    @Body() dto: CreateOpportunityDto,
  ) {
    return this.service.create(userId, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an opportunity" })
  async update(
    @CurrentUser("id") userId: string,
    @Param("id") id: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.service.update(userId, id, dto);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Transition opportunity status" })
  async updateStatus(
    @CurrentUser("id") userId: string,
    @Param("id") id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.service.updateStatus(userId, id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete an opportunity" })
  async remove(
    @CurrentUser("id") userId: string,
    @Param("id") id: string,
  ) {
    return this.service.remove(userId, id);
  }

  // ── Checklist sub-routes ───────────────────────

  @Post(":id/checklist")
  @ApiOperation({ summary: "Add a checklist item to opportunity" })
  async addChecklistItem(
    @CurrentUser("id") userId: string,
    @Param("id") oppId: string,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.service.addChecklistItem(userId, oppId, dto);
  }

  @Patch(":id/checklist/:itemId")
  @ApiOperation({ summary: "Update a checklist item" })
  async updateChecklistItem(
    @CurrentUser("id") userId: string,
    @Param("id") oppId: string,
    @Param("itemId") itemId: string,
    @Body() dto: UpdateChecklistItemDto,
  ) {
    return this.service.updateChecklistItem(userId, oppId, itemId, dto);
  }

  @Delete(":id/checklist/:itemId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove a checklist item" })
  async removeChecklistItem(
    @CurrentUser("id") userId: string,
    @Param("id") oppId: string,
    @Param("itemId") itemId: string,
  ) {
    return this.service.removeChecklistItem(userId, oppId, itemId);
  }
}

