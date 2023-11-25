import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
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
import {
  AddManagementDto,
  CheckManagementDto,
  FilterAndPaginationManagementDto,
  OptionManagementDto,
  UpdateManagementDto,
} from '../../dto/management.dto';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { ManagementService } from './management.service';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';
import { GetTokenUser } from '../../decorator/get-token-user.decorator';
import { User } from '../../interfaces/user/user.interface';

@Controller('management')
export class ManagementController {
  private logger = new Logger(ManagementController.name);

  constructor(private managementService: ManagementService) {}

  /**
   * addManagement
   * insertManyManagement
   */
  @Post('/add')
  // @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.CREATE)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async addManagement(
    @Body()
    addManagementDto: AddManagementDto,
  ): Promise<ResponsePayload> {
    return await this.managementService.addManagement(addManagementDto);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyManagement(
    @Body()
    body: {
      data: AddManagementDto[];
      option: OptionManagementDto;
    },
  ): Promise<ResponsePayload> {
    return await this.managementService.insertManyManagement(body.data, body.option);
  }

  /**
   * getAllManagements
   * getManagementById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllManagements(
    @Body() filterManagementDto: FilterAndPaginationManagementDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.managementService.getAllManagements(filterManagementDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllManagementsBasic(): Promise<ResponsePayload> {
    return await this.managementService.getAllManagementsBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getManagementById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.managementService.getManagementById(id, select);
  }

  /**
   * updateManagementById
   * updateMultipleManagementById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  // @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.EDIT)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async updateManagementById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateManagementDto: UpdateManagementDto,
  ): Promise<ResponsePayload> {
    return await this.managementService.updateManagementById(id, updateManagementDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateMultipleManagementById(
    @Body() updateManagementDto: UpdateManagementDto,
  ): Promise<ResponsePayload> {
    return await this.managementService.updateMultipleManagementById(
      updateManagementDto.ids,
      updateManagementDto,
    );
  }

  /**
   * deleteManagementById
   * deleteMultipleManagementById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  // @UsePipes(ValidationPipe)
  // @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  // @UseGuards(AdminRolesGuard)
  // @AdminMetaPermissions(AdminPermissions.DELETE)
  // @UseGuards(AdminPermissionGuard)
  // @UseGuards(AdminJwtAuthGuard)
  async deleteManagementById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.managementService.deleteManagementById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleManagementById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.managementService.deleteMultipleManagementById(
      data.ids,
      Boolean(checkUsage),
    );
  }

  @Post('/check-management-availability')
  @UsePipes(ValidationPipe)
  @UseGuards(UserJwtAuthGuard)
  async checkManagementAvailability(
    @GetTokenUser() user: User,
    @Body() checkManagementDto: CheckManagementDto,
  ): Promise<ResponsePayload> {
    return await this.managementService.checkManagementAvailability(
      user,
      checkManagementDto,
    );
  }
}
