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
import { UtilsService } from '../../../shared/utils/utils.service';
import { JobType } from '../../../interfaces/common/jobType.interface';
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddJobTypeDto,
  FilterAndPaginationJobTypeDto,
  OptionJobTypeDto,
  UpdateJobTypeDto,
} from '../../../dto/jobType.dto';
import { Product } from '../../../interfaces/common/product.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class JobTypeService {
  private logger = new Logger(JobTypeService.name);

  constructor(
    @InjectModel('JobType') private readonly jobTypeModel: Model<JobType>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addJobType
   * insertManyJobType
   */
  async addJobType(addJobTypeDto: AddJobTypeDto): Promise<ResponsePayload> {
    const { name, slug } = addJobTypeDto;

    try {
      let finalSlug;
      const fData = await this.jobTypeModel.findOne({ slug: slug });

      if (fData) {
        finalSlug = this.utilsService.transformToSlug(slug, true);
      } else {
        finalSlug = slug;
      }

      const defaultData = {
        slug: finalSlug,
      };
      const mData = { ...addJobTypeDto, ...defaultData };
      const newData = new this.jobTypeModel(mData);

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

  async insertManyJobType(
    addJobTypesDto: AddJobTypeDto[],
    optionJobTypeDto: OptionJobTypeDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionJobTypeDto;
    if (deleteMany) {
      await this.jobTypeModel.deleteMany({});
    }
    const mData = addJobTypesDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.name),
        },
      };
    });
    try {
      const saveData = await this.jobTypeModel.insertMany(mData);
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
   * getAllJobTypes
   * getJobTypeById
   */
  async getAllJobTypesBasic() {
    try {
      const pageSize = 10;
      const currentPage = 3;
      const data = await this.jobTypeModel
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

  async getAllJobTypes(
    filterJobTypeDto: FilterAndPaginationJobTypeDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterJobTypeDto;
    const { pagination } = filterJobTypeDto;
    const { sort } = filterJobTypeDto;
    const { select } = filterJobTypeDto;

    // Essential Variables
    const aggregateSjobTypees = [];
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
      mSelect = { name: 1 };
    }

    // Finalize
    if (Object.keys(mFilter).length) {
      aggregateSjobTypees.push({ $match: mFilter });
    }

    if (Object.keys(mSort).length) {
      aggregateSjobTypees.push({ $sort: mSort });
    }

    if (!pagination) {
      aggregateSjobTypees.push({ $project: mSelect });
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

      aggregateSjobTypees.push(mPagination);

      aggregateSjobTypees.push({
        $project: {
          data: 1,
          count: { $arrayElemAt: ['$metadata.total', 0] },
        },
      });
    }

    try {
      const dataAggregates = await this.jobTypeModel.aggregate(aggregateSjobTypees);
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

  async getJobTypeById(id: string, select: string): Promise<ResponsePayload> {
    try {
      const data = await this.jobTypeModel.findById(id).select(select);
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
   * updateJobTypeById
   * updateMultipleJobTypeById
   */
  async updateJobTypeById(
    id: string,
    updateJobTypeDto: UpdateJobTypeDto,
  ): Promise<ResponsePayload> {
    try {
      const { name, slug } = updateJobTypeDto;

      let finalSlug;
      const fData = await this.jobTypeModel.findById(id);

      // Check Slug
      if (fData.slug !== slug) {
        const fData = await this.jobTypeModel.findOne({ slug: slug });
        if (fData) {
          finalSlug = this.utilsService.transformToSlug(slug, true);
        } else {
          finalSlug = slug;
        }
      } else {
        finalSlug = slug;
      }

      const defaultData = {
        slug: finalSlug,
      };

      const finalData = { ...updateJobTypeDto, ...defaultData };

      await this.jobTypeModel.findByIdAndUpdate(id, {
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

  async updateMultipleJobTypeById(
    ids: string[],
    updateJobTypeDto: UpdateJobTypeDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updateJobTypeDto.slug) {
      delete updateJobTypeDto.slug;
    }

    try {
      await this.jobTypeModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateJobTypeDto },
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
   * deleteJobTypeById
   * deleteMultipleJobTypeById
   */
  async deleteJobTypeById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.jobTypeModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      await this.jobTypeModel.findByIdAndDelete(id);
      // Reset Product JobType Reference
      if (checkUsage) {
        // Update Product
        await this.productModel.updateMany(
          {},
          {
            $pull: { jobTypes: new ObjectId(id) },
          },
        );
      }
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleJobTypeById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      await this.jobTypeModel.deleteMany({ _id: ids });
      // Reset Product Brand Reference
      if (checkUsage) {
        // Update Product
        await this.productModel.updateMany(
          {},
          { $pull: { jobTypes: { $in: mIds } } },
        );
      }
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
