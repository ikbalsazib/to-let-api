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
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../../pipes/mongo-id-validation.pipe';
import {
  AddChildCategoryDto,
  FilterAndPaginationChildCategoryDto,
  OptionChildCategoryDto,
  UpdateChildCategoryDto,
} from '../../../dto/child-category.dto';
import { ChildCategoryService } from './child-category.service';
import { UpdateCategoryDto } from '../../../dto/category.dto';

@Controller('child-category')
export class ChildCategoryController {
  private logger = new Logger(ChildCategoryController.name);

  constructor(private childCategoryService: ChildCategoryService) {}

  /**
   * addChildCategory
   * insertManyChildCategory
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async addChildCategory(
    @Body()
    addChildCategoryDto: AddChildCategoryDto,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.addChildCategory(
      addChildCategoryDto,
    );
  }

  @Post('/insert-many')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.CREATE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async insertManyChildCategory(
    @Body()
    body: {
      data: AddChildCategoryDto[];
      option: OptionChildCategoryDto;
    },
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.insertManyChildCategory(
      body.data,
      body.option,
    );
  }

  /**
   * getAllChildCategories
   * getChildCategoryById
   * changeMultipleChildCategoryStatus()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllChildCategories(
    @Body() filterChildCategoryDto: FilterAndPaginationChildCategoryDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.childCategoryService.getAllChildCategories(
      filterChildCategoryDto,
      searchString,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-data-group-by-category-sub-category')
  @UsePipes(ValidationPipe)
  async getGroupData(): Promise<ResponsePayload> {
    return this.childCategoryService.getGroupData();
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN, AdminRoles.ADMIN)
  @UseGuards(AdminRolesGuard)
  @UseGuards(AdminJwtAuthGuard)
  async getChildCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.getChildCategoryById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-by-parent/:id')
  async getChildCategoriesByCategoryId(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('select') select: string,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.getChildCategoriesByCategoryId(
      id,
      select,
    );
  }

  /**
   * updateChildCategoryById()
   * updateMultipleChildCategoryById()
   * changeMultipleChildCategoryStatus()
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateChildCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateChildCategoryDto: UpdateChildCategoryDto,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.updateChildCategoryById(
      id,
      updateChildCategoryDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateMultipleChildCategoryById(
    @Body() updateChildCategoryDto: UpdateChildCategoryDto,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.updateMultipleChildCategoryById(
      updateChildCategoryDto.ids,
      updateChildCategoryDto,
    );
  }

  @Version(VERSION_NEUTRAL)
  @Put('/change-multiple-child-category-status')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async changeMultipleChildCategoryStatus(
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.changeMultipleChildCategoryStatus(
      updateCategoryDto.ids,
      updateCategoryDto,
    );
  }

  /**
   * deleteChildCategoryById
   * deleteMultipleChildCategoryById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteChildCategoryById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.deleteChildCategoryById(
      id,
      Boolean(checkUsage),
    );
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteMultipleChildCategoryById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.childCategoryService.deleteMultipleChildCategoryById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
