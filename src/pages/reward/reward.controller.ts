import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AdminMetaRoles } from '../../decorator/admin-roles.decorator';
import { AdminRoles } from '../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../../guards/admin-roles.guard';
import { AdminMetaPermissions } from '../../decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../../guards/admin-permission.guard';
import { AdminJwtAuthGuard } from '../../guards/admin-jwt-auth.guard';
import { AddRewardDto } from '../../dto/reward.dto';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { RewardService } from './reward.service';

@Controller('reward')
export class RewardController {
  private logger = new Logger(RewardController.name);

  constructor(private shippingChargeService: RewardService) {}

  /**
   * addReward
   * insertManyReward
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addReward(
    @Body()
    addRewardDto: AddRewardDto,
  ): Promise<ResponsePayload> {
    return await this.shippingChargeService.addReward(addRewardDto);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get')
  async getReward(@Query() select: string): Promise<ResponsePayload> {
    return await this.shippingChargeService.getReward(select);
  }
}
