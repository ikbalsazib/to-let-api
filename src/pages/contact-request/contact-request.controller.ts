/* eslint-disable prettier/prettier */
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
  AddContactRequestDto,
  FilterAndPaginationContactRequestDto,
  GetContactRequestByIdsDto,
  OptionContactRequestDto,
  UpdateContactRequestDto,
} from '../../dto/contact-request.dto';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { MongoIdValidationPipe } from '../../pipes/mongo-id-validation.pipe';
import { ContactRequestService } from './contact-request.service';
import { GetUser } from '../../decorator/get-user.decorator';
import { User } from '../../interfaces/user/user.interface';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';
import {
  FilterAndPaginationProductDto,
  GetProductByIdsDto,
} from '../../dto/product.dto';
import { AuthGuard } from '@nestjs/passport';
import { PASSPORT_USER_TOKEN_TYPE } from '../../core/global-variables';
import { GetTokenUser } from 'src/decorator/get-token-user.decorator';

@Controller('contact-request')
export class ContactRequestController {
  private logger = new Logger(ContactRequestController.name);

  constructor(private contactRequestService: ContactRequestService) {}

  /**
   * addContactRequest
   * insertManyContactRequest
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  @UseGuards(UserJwtAuthGuard)
  async addContactRequest(
    @GetUser() user: User,
    @Body()
    addContactRequestDto: AddContactRequestDto,
  ): Promise<ResponsePayload> {
    return await this.contactRequestService.addContactRequest(user, addContactRequestDto);
  }

  @Post('/add-by-admin')
  // @UsePipes(ValidationPipe)
  // @UseGuards(UserJwtAuthGuard)
  async addContactRequestByAdmin(
    @Body()
      addContactRequestDto: AddContactRequestDto,
  ): Promise<ResponsePayload> {
    return await this.contactRequestService.addContactRequestByAdmin(addContactRequestDto);
  }

  /**
   * getAllContactRequests
   * getContactRequestById
   */

  @Version(VERSION_NEUTRAL)
  @Get('/get-all-contact-request')
  @UsePipes(ValidationPipe)
  async getAllContactRequests(): Promise<ResponsePayload> {
    return this.contactRequestService.getAllContactRequests();
  }

  @Version(VERSION_NEUTRAL)
  @Post('/get-all-contact-request-by-query')
  @UsePipes(ValidationPipe)
  async getAllContactRequestsByQuery(
    @Body() filterContactRequestDto: FilterAndPaginationContactRequestDto,
    @Query('q') searchString: string,
  ): Promise<ResponsePayload> {
    return this.contactRequestService.getAllContactRequestsByQuery(
      filterContactRequestDto,
      searchString,
    );
  }
  /**
   * getCartByUserId()
   */
  @Version(VERSION_NEUTRAL)
  @Get('/get-contact-request-by-user')
  @UsePipes(ValidationPipe)
  @UseGuards(UserJwtAuthGuard)
  async getCartByUserId(@GetTokenUser() user: User): Promise<ResponsePayload> {
    console.log(user);
    
    return this.contactRequestService.getContactRequestByUserId(user);
   
    
  }


  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getContactRequestById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.contactRequestService.getContactRequestById(id, select);
  }



  @Version(VERSION_NEUTRAL)
  @Get('get-contact-request-user-by-id/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(UserJwtAuthGuard)
  async getContactRequestUserById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
    @GetTokenUser() user: User
  ): Promise<ResponsePayload> {
    return await this.contactRequestService.getContactRequestUserById(id,user, select);
  }

  /**
   * updateContactRequestById
   * updateMultipleContactRequestById
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateContactRequestById(
    @Body() updateContactRequestDto: UpdateContactRequestDto,
  ): Promise<ResponsePayload> {
    console.log('updateContactRequestDto', updateContactRequestDto);
    return await this.contactRequestService.updateContactRequestById(updateContactRequestDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-and-contact-request-remove')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.EDIT)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async updateContactRequestByIdAndDelete(
    @Body() updateContactRequestDto: UpdateContactRequestDto,
  ): Promise<ResponsePayload> {
    console.log('updateContactRequestDto', updateContactRequestDto);
    return await this.contactRequestService.updateContactRequestByIdAndDelete(updateContactRequestDto);
  }

  /**
   * deleteContactRequestById
   * deleteMultipleContactRequestById
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  @AdminMetaRoles(AdminRoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  @AdminMetaPermissions(AdminPermissions.DELETE)
  @UseGuards(AdminPermissionGuard)
  @UseGuards(AdminJwtAuthGuard)
  async deleteContactRequestById(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<ResponsePayload> {
    return await this.contactRequestService.deleteContactRequestById(id);
  }

  @Version(VERSION_NEUTRAL)
  @Delete('/delete-loggedin-user-contact-request/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(PASSPORT_USER_TOKEN_TYPE))
  async deleteContactRequestByLoggedinUserAndContactRequestId(
    @Param('id', MongoIdValidationPipe) id: string,
    @GetUser() user: User,
  ): Promise<ResponsePayload> {
    return await this.contactRequestService.deleteContactRequestByLoggedinUserAndContactRequestId(
      id,
      user,
    );
  }
}
