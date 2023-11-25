/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../shared/utils/utils.service';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../enum/error-code.enum';
import {
  AddContactRequestDto,
  FilterAndPaginationContactRequestDto,
  UpdateContactRequestDto,
} from '../../dto/contact-request.dto';
import { Product } from '../../interfaces/common/product.interface';
import { ContactRequest } from 'src/interfaces/common/contact-request.interface';
import { User } from '../../interfaces/user/user.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class ContactRequestService {
  private logger = new Logger(ContactRequestService.name);

  constructor(
    @InjectModel('ContactRequest') private readonly contactRequestModel: Model<ContactRequest>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addContactRequest
   * insertManyContactRequest
   */
  async addContactRequest(
    user: User,
    addContactRequestDto: AddContactRequestDto,
  ): Promise<ResponsePayload> {
    try {

      const conRequestData = await  this.contactRequestModel.findOne({'product._id': addContactRequestDto.product, 'user._id': user._id})
      if (conRequestData){

        return {
          success: false,
          message: 'We received your request, Our team contact you soon.',
        } as ResponsePayload;
      }

      else {

        const productData = await this.productModel
            .findById({ _id: addContactRequestDto.product });

        const userData = await this.userModel
            .findById({ _id: user._id });
        const mData = {
          ...addContactRequestDto,
          ...{
            product: productData,
            user: userData,
          },
        };
        const newData = new this.contactRequestModel(mData);
        await newData.save();

        return {
          success: true,
          message: 'Request Successfully!',
        } as ResponsePayload;
      }

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async addContactRequestByAdmin(addContactRequestDto: AddContactRequestDto): Promise<ResponsePayload> {
    try {
      const productData = await this.productModel
        .findById({ _id: addContactRequestDto.product })
        .select('name slug images');

      const mData = {
        ...addContactRequestDto,
        ...{
          product: {
            _id: productData._id,
            name: productData.name,
            images: productData.images,
            slug: productData.slug,
          },
          user: {
            _id: null,
            // name: addContactRequestDto.name,
            profileImg: null,
          },
        },
      };
      const newData = new this.contactRequestModel(mData);
      await newData.save();



      return {
        success: true,
        message: 'Contact Request Successfully!',
      } as ResponsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * getAllContactRequestsByQuery()
   * getAllContactRequests()
   * getContactRequestById()
   */
  /**
   * getCartByUserId()
   */
  async getContactRequestByUserId(user: User): Promise<ResponsePayload> {
    console.log(user);

    try {
      const data = await this.contactRequestModel
        .find({ 'user._id': user._id })
        .populate('user', 'name phoneNo profileImg username')
        .populate('product', 'name slug images ')
        .sort({ createdAt: -1 });

      return {
        data: data,
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getAllContactRequestsByQuery(
    filterContactRequestDto: FilterAndPaginationContactRequestDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterContactRequestDto;
    const { pagination } = filterContactRequestDto;
    const { sort } = filterContactRequestDto;
    const { select } = filterContactRequestDto;
    const { filterGroup } = filterContactRequestDto;

    // Essential Variables
    const aggregateStages = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match

    if (filter) {
      if (filter['product._id']) {
        filter['product._id'] = new ObjectId(filter['product._id']);
      }
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = {
        $and: [
          mFilter,
          {
            $or: [
              { orderId: { $regex: searchQuery, $options: 'i' } },
              { phoneNo: { $regex: searchQuery, $options: 'i' } },
            ],
          },
        ],
      };
    }
    // Sort
    if (sort) {
      mSort = sort;
    } else {
      mSort = { createdAt: -1 };
    }

    // Select
    if (select) {
      mSelect = { ...select };
    } else {
      mSelect = { name: 1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateStages.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateStages.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateStages.push({ $project: mSelect });
    }

    // Pagination
    if (pagination) {
      if (Object.keys(mSelect).length) {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
              { $project: mSelect },
            ],
          },
        };
      } else {
        mPagination = {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: pagination.pageSize * pagination.currentPage,
              } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
              { $limit: pagination.pageSize },
            ],
          },
        };
      }

      aggregateStages.push(mPagination);

      aggregateStages.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.contactRequestModel.aggregate(aggregateStages);
      // .populate('user', 'fullName profileImg username')
      //     .populate('product', 'productName productSlug images categorySlug')
      //     .sort({createdAt: -1})

      if (pagination) {
        return {
          ...{ ...dataAggregates[0] },
          ...{ success: true, message: 'Success' },
        } as ResponsePayload;
      } else {
        return {
          data: dataAggregates,
          success: true,
          message: 'Success',
          count: dataAggregates.length,
        } as ResponsePayload;
      }
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAllContactRequests(): Promise<ResponsePayload> {
    try {
      const contactRequests = await this.contactRequestModel
        .find()
        .populate('user', 'name phoneNo profileImg username')
        .populate('product', 'name slug bioDataType guardianNumber receiveBiodata')
        .sort({ createdAt: -1 });
      return {
        success: true,
        message: 'Success',
        data: contactRequests,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getContactRequestById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.contactRequestModel.findById(id).select(select);

      // const contactRequestId = req.params.contactRequestId;
      // const contactRequest = await ContactRequestControl.findOne({_id: contactRequestId});

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }



  async getContactRequestUserById(id: string,user:User, select: string): Promise<ResponsePayload> {
    try {
      console.log("id----",id)
      console.log("user----",user)
      const data = await this.contactRequestModel.findOne({'product._id': id, 'user._id':user._id});

      console.log("data--------",data)
      // const contactRequestId = req.params.contactRequestId;
      // const contactRequest = await ContactRequestControl.findOne({_id: contactRequestId});

      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * updateContactRequestById
   * updateMultipleContactRequestById
   */
  async updateContactRequestById(
    updateContactRequestDto: UpdateContactRequestDto,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.contactRequestModel.findById(updateContactRequestDto);
      console.log('updateContactRequestDto++++', updateContactRequestDto);
      console.log('data++++', data);

      if (data.status === updateContactRequestDto.status) {
        await this.contactRequestModel.updateOne(
          { _id: updateContactRequestDto },
          { $set: updateContactRequestDto },
        );
      } else {
        if (data.status === true && updateContactRequestDto.status === false) {
          await this.contactRequestModel.updateOne(
            { _id: updateContactRequestDto },
            { $set: updateContactRequestDto },
          );


        } else {
          await this.contactRequestModel.updateOne(
            { _id: updateContactRequestDto },
            { $set: updateContactRequestDto },
          );


        }
      }

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.log('update', err);
      throw new InternalServerErrorException();
    }
  }

  async updateContactRequestByIdAndDelete(
    updateContactRequestDto: UpdateContactRequestDto,
  ): Promise<ResponsePayload> {
    try {
      await this.contactRequestModel.updateOne(
        { _id: updateContactRequestDto },
        { $set: updateContactRequestDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      console.log('update', err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * deleteContactRequestById
   * deleteMultipleContactRequestById
   */
  async deleteContactRequestById(id: string): Promise<ResponsePayload> {
    try {
      await this.contactRequestModel.deleteOne({ _id: id });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteContactRequestByLoggedinUserAndContactRequestId(
    id: string,
    user: User,
  ): Promise<ResponsePayload> {
    try {
      await this.contactRequestModel.deleteOne({ _id: id, 'user._id': user._id });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
