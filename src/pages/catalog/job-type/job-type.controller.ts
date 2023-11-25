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
import { AdminMetaRoles } from '../../../decorator/admin-roles.decorator';
import { AdminRoles } from '../../../enum/admin-roles.enum';
import { AdminRolesGuard } from '../../../guards/admin-roles.guard';
import { AdminMetaPermissions } from '../../../decorator/admin-permissions.decorator';
import { AdminPermissions } from '../../../enum/admin-permission.enum';
import { AdminPermissionGuard } from '../../../guards/admin-permission.guard';
import { AdminJwtAuthGuard } from '../../../guards/admin-jwt-auth.guard';
import {
  AddJobTypeDto,
  FilterAndPaginationJobTypeDto,
  OptionJobTypeDto,
  UpdateJobTypeDto,
} from '../../../dto/jobType.dto';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import { JobTypeService } from './job-type.service';

@Controller('jobType')
export class JobTypeController {
  private logger = new Logger(JobTypeController.name);

  constructor(private jobTypeService: JobTypeService) {}

  /**
   * addJobType
   * insertManyJobType
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addJobType(
    @Body()
    addJobTypeDto: AddJobTypeDto,
  ): Promise<ResponsePayload> {
    return await this.jobTypeService.addJobType(addJobTypeDto);
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyJobType(
    @Body()
    body: {
      data: AddJobTypeDto[];
      option: OptionJobTypeDto;
    },
  ): Promise<ResponsePayload> {
    return await this.jobTypeService.insertManyJobType(body.data, body.option);
  }

  /**
   * getAllJobTypes
   * getJobTypeById
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllJobTypes(
    @Body() filterJobTypeDto: FilterAndPaginationJobTypeDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.jobTypeService.getAllJobTypes(filterJobTypeDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-basic')
  async getAllJobTypesBasic(): Promise<ResponsePayload> {
    return await this.jobTypeService.getAllJobTypesBasic();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getJobTypeById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.jobTypeService.getJobTypeById(id, select);
  }

  /**
   * updateJobTypeById
   * updateMultipleJobTypeById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateJobTypeById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateJobTypeDto: UpdateJobTypeDto,
  ): Promise<ResponsePayload> {
    return await this.jobTypeService.updateJobTypeById(id, updateJobTypeDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateMultipleJobTypeById(
    @Body() updateJobTypeDto: UpdateJobTypeDto,
  ): Promise<ResponsePayload> {
    return await this.jobTypeService.updateMultipleJobTypeById(
      updateJobTypeDto.ids,
      updateJobTypeDto,
    );
  }

  /**
   * deleteJobTypeById
   * deleteMultipleJobTypeById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteJobTypeById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.jobTypeService.deleteJobTypeById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleJobTypeById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.jobTypeService.deleteMultipleJobTypeById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
