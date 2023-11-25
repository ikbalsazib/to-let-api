import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../shared/utils/utils.service';
import { Management } from '../../interfaces/common/management.interface';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../enum/error-code.enum';
import {
  AddManagementDto,
  CheckManagementDto,
  FilterAndPaginationManagementDto,
  OptionManagementDto,
  UpdateManagementDto,
} from '../../dto/management.dto';
import { User } from '../../interfaces/user/user.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class ManagementService {
  private logger = new Logger(ManagementService.name);

  constructor(
    @InjectModel('Management') private readonly managementModel: Model<Management>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addManagement
   * insertManyManagement
   */
  async addManagement(addManagementDto: AddManagementDto): Promise<ResponsePayload> {
    const { name } = addManagementDto;

    const defaultData = {
      slug: this.utilsService.transformToSlug(name),
    };
    const mData = { ...addManagementDto, ...defaultData };
    const newData = new this.managementModel(mData);
    try {
      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };
      return {
        success: true,
        message: 'Data Added Successfully',
        data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async insertManyManagement(
    addManagementsDto: AddManagementDto[],
    optionManagementDto: OptionManagementDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionManagementDto;
    if (deleteMany) {
      await this.managementModel.deleteMany({});
    }
    const mData = addManagementsDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.name),
        },
      };
    });
    try {
      const saveData = await this.managementModel.insertMany(mData);
      return {
        success: true,
        message: `${
          saveData && saveData.length ? saveData.length : 0
        }  Data Added Success`,
      } as ResponsePayload;
    } catch (error) {
      // console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * getAllManagements
   * getManagementById
   */
  async getAllManagementsBasic() {
    try {
      const pageSize = 10;
      const currentPage = 1;
      
      const data = await this.managementModel
        .find()
        .skip(pageSize * (currentPage - 1))
        .limit(Number(pageSize));
      return {
        success: true,
        message: 'Success',
      
        
        data,
     
        
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllManagements(
    filterManagementDto: FilterAndPaginationManagementDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterManagementDto;
    const { pagination } = filterManagementDto;
    const { sort } = filterManagementDto;
    const { select } = filterManagementDto;

    // Essential Variables
    const aggregateSmanagementes = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    if (filter) {
      mFilter = { ...mFilter, ...filter };
    }
    if (searchQuery) {
      mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
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
      mSelect = { 
        name: 1,
       };
    }   

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateSmanagementes.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSmanagementes.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSmanagementes.push({ $project: mSelect });
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

      aggregateSmanagementes.push(mPagination);

      aggregateSmanagementes.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.managementModel.aggregate(
        aggregateSmanagementes,
      );
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
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getManagementById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.managementModel.findById(id).select(select);
      return {
        success: true,
        message: 'Single management get Successfully',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * updateManagementById
   * updateMultipleManagementById
   */
  async updateManagementById(
    id: string,
    updateManagementDto: UpdateManagementDto,
  ): Promise<ResponsePayload> {
    const { name } = updateManagementDto;
    let data;
    try {
      data = await this.managementModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateManagementDto };

      await this.managementModel.findByIdAndUpdate(id, {
        $set: finalData,
      });
      return {
        success: true,
        message: 'Update Successfully',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleManagementById(
    ids: string[],
    updateManagementDto: UpdateManagementDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.managementModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateManagementDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * deleteManagementById
   * deleteMultipleManagementById
   */
  async deleteManagementById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.managementModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.managementModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Delete Successfully',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleManagementById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.managementModel.deleteMany({ _id: ids });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * COUPON FUNCTIONS
   * generateOtpWithPhoneNo()
   * validateOtpWithPhoneNo()
   */
  async checkManagementAvailability(
    user: User,
    checkManagementDto: CheckManagementDto,
  ): Promise<ResponsePayload> {
    try {
      const { managementCode, subTotal } = checkManagementDto;

      const managementData = await this.managementModel.findOne({ managementCode });

      if (managementData) {
        const isExpired = this.utilsService.getDateDifference(
          new Date(),
          // new Date(managementData.endDateTime),
          'seconds',
        );

        const isStartDate = this.utilsService.getDateDifference(
          new Date(),
          // new Date(managementData.startDateTime),
          'seconds',
        );

        if (isStartDate > 0) {
          return {
            success: false,
            message: 'Sorry! Management offer is not start yet',
            data: null,
          } as ResponsePayload;
        }

        if (isExpired <= 0) {
          return {
            success: false,
            message: 'Sorry! Management Expired',
            data: null,
          } as ResponsePayload;
        } else {
          const userManagementExists = await this.userModel.findOne({
            _id: user._id,
            usedManagements: managementData._id,
          });

          if (userManagementExists) {
            return {
              success: false,
              message: 'Sorry! Management already used in your account.',
              data: null,
            } as ResponsePayload;
          } else {
            if (managementData['minimumAmount'] > subTotal) {
              return {
                success: false,
                message: `Sorry! Management minimum amount is ${managementData['minimumAmount']}`,
                data: null,
              } as ResponsePayload;
            } else {
              return {
                success: true,
                message: 'Success! Management added.',
                data: {
                  _id: managementData._id,
                  discountAmount: managementData['discountAmount'],
                  discountType: managementData['discountType'],
                  managementCode: managementData['managementCode'],
                },
              } as ResponsePayload;
            }
          }
        }
      } else {
        return {
          success: false,
          message: 'Sorry! Invalid management code',
          data: null,
        } as ResponsePayload;
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
