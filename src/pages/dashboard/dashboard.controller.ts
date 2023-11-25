import {
  Controller,
  Get,
  Logger,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';

@Controller('dashboard')
export class DashboardController {
  private logger = new Logger(DashboardController.name);

  constructor(private dashboardService: DashboardService) {}

  /**
   * GET
   * getAdminDashboard()
   */

  @Version(VERSION_NEUTRAL)
  @Get('/post-count')
  async getPostCount(): Promise<ResponsePayload> {
    return await this.dashboardService.getPostCount();
  }

  // @Version(VERSION_NEUTRAL)
  // @Post('/admin-dashboard-order')
  // // @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  // // @UseGuards(AdminRolesGuard)
  // // @UseGuards(AdminJwtAuthGuard)
  // async getAllOrdersForDashbord(
  //   @Body() filterOrderDto: FilterAndPaginationOrderDto,
  //   @Query('q') searchString: string,
  // ): Promise<ResponsePayload> {
  //   return this.dashboardService.getAllOrdersForDashbord(
  //     filterOrderDto,
  //     searchString,
  //   );
  // }
}
