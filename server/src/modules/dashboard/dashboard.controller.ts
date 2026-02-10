/**
 * Dashboard Controller
 */

import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("dashboard")
@ApiBearerAuth()
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  @ApiOperation({ summary: "Get dashboard statistics" })
  async getStats(@CurrentUser("id") userId: string) {
    return this.dashboardService.getStats(userId);
  }

  @Get("deadlines")
  @ApiOperation({ summary: "Get upcoming deadlines" })
  async getDeadlines(
    @CurrentUser("id") userId: string,
    @Query("days") days?: number,
  ) {
    return this.dashboardService.getUpcomingDeadlines(userId, days);
  }
}
