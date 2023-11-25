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
import { ResponsePayload } from '../../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../../enum/error-code.enum';
import {
  AddChildCategoryDto,
  FilterAndPaginationChildCategoryDto,
  OptionChildCategoryDto,
  UpdateChildCategoryDto,
} from '../../../dto/child-category.dto';
import { ChildCategory } from '../../../interfaces/common/child-category.interface';
import { Product } from '../../../interfaces/common/product.interface';
import { UpdateCategoryDto } from '../../../dto/category.dto';
import { SubCategory } from '../../../interfaces/common/sub-category.interface';
import { FilterAndPaginationBrandDto } from '../../../dto/brand.dto';
import { Category } from '../../../interfaces/common/category.interface';

const ObjectId = Types.ObjectId;

@Injectable()
export class ChildCategoryService {
  private logger = new Logger(ChildCategoryService.name);

  constructor(
    @InjectModel('ChildCategory')
    private readonly childCategoryModel: Model<ChildCategory>,
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
    @InjectModel('SubCategory')
    private readonly subCategoryModel: Model<SubCategory>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addChildCategory
   * insertManyChildCategory
   */
  async addChildCategory(
    addChildCategoryDto: AddChildCategoryDto,
  ): Promise<ResponsePayload> {
    const { name } = addChildCategoryDto;

    const defaultData = {
      slug: this.utilsService.transformToSlug(name),
    };
    const mData = { ...addChildCategoryDto, ...defaultData };
    const newData = new this.childCategoryModel(mData);
    try {
      const saveData = await newData.save();
      const data = {
        _id: saveData._id,
      };
      return {
        success: true,
        message: 'Data Added Success',
        data,
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

  async insertManyChildCategory(
    addChildCategorysDto: AddChildCategoryDto[],
    optionChildCategoryDto: OptionChildCategoryDto,
  ): Promise<ResponsePayload> {
    const { deleteMany } = optionChildCategoryDto;
    if (deleteMany) {
      await this.childCategoryModel.deleteMany({});
    }
    const mData = addChildCategorysDto.map((m) => {
      return {
        ...m,
        ...{
          slug: this.utilsService.transformToSlug(m.name),
        },
      };
    });
    try {
      const saveData = await this.childCategoryModel.insertMany(mData);
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
   * getAllChildCategories
   * getChildCategoryById
   */
  async getAllChildCategories(
    filterBrandDto: FilterAndPaginationBrandDto,
    searchQuery?: string,
  ): Promise<ResponsePayload> {
    const { filter } = filterBrandDto;
    const { pagination } = filterBrandDto;
    const { sort } = filterBrandDto;
    const { select } = filterBrandDto;

    // Essential Variables
    const aggregateStages = [];
    let mFilter = {};
    let mSort = {};
    let mSelect = {};
    let mPagination = {};

    // Match
    // Match
    if (filter) {
      if (filter['subCategory._id']) {
        filter['subCategory._id'] = new ObjectId(filter['subCategory._id']);
      }
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
      const dataAggregates = await this.childCategoryModel.aggregate(
        aggregateStages,
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
        throw new InternalServerErrorException();
      }
    }
  }

  async getChildCategoryById(
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.childCategoryModel.findById(id).select(select);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getChildCategoriesByCategoryId(
    id: string,
    select: string,
  ): Promise<ResponsePayload> {
    try {
      const data = await this.childCategoryModel
        .find({ 'subCategory._id': id })
        .select(select);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getChildCategoriesGroupByCategory(): Promise<ResponsePayload> {
    // Essential Variables
    const aggregateStages = [];

    aggregateStages.push({
      $match: {
        readOnly: { $ne: true },
        status: 'publish',
      },
    });

    aggregateStages.push({
      $group: {
        _id: '$category',
        childCategories: {
          $push: '$$ROOT',
        },
      },
    });

    aggregateStages.push({
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    });

    try {
      const dataAggregates = await this.childCategoryModel.aggregate(
        aggregateStages,
      );
      const mDataAggregates = JSON.parse(JSON.stringify(dataAggregates));

      const filteredData: any[] = [];

      mDataAggregates.forEach((m) => {
        if (
          m.category[0]?.status === 'publish' &&
          m.category[0]?.readOnly !== true
        ) {
          const data = {
            _id: m._id,
            name: m.category[0].name,
            image: m.category[0].image,
            slug: m.category[0].slug,
            readOnly: m.category[0].readOnly,
            serial: m.category[0].serial,
            childCategories: m.childCategories,
            status: m.category[0].status,
          };
          filteredData.push(data);
        }
      });
      return {
        data: filteredData,
        success: true,
        message: 'Success',
        count: dataAggregates.length,
      } as ResponsePayload;
    } catch (err) {
      this.logger.error(err);
      if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
        throw new BadRequestException('Error! Projection mismatch');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getGroupData(): Promise<ResponsePayload> {
    try {
      const categoryData = await this.categoryModel.find({
        status: 'publish',
      });

      const mCategoryData = JSON.parse(JSON.stringify(categoryData));

      const data: any = [];

      for (const cat of mCategoryData) {
        const subCats = await this.subCategoryModel.find({
          category: cat._id,
          status: 'publish',
        });

        const mSubCats = JSON.parse(JSON.stringify(subCats));

        const subChildArray = [];
        for (const subCat of mSubCats) {
          const childCats = await this.childCategoryModel.find({
            'subCategory._id': subCat._id,
            status: 'publish',
          });
          const mChildCats = JSON.parse(JSON.stringify(childCats));
          const obj = {
            _id: subCat._id,
            image: subCat.image,
            name: subCat.name,
            nameBn: cat.nameBn,
            nameIt: cat.nameIt,
            slug: subCat.slug,
            childCategories: mChildCats.map((c) => {
              return {
                _id: c._id,
                image: c.image,
                name: c.name,
                nameBn: cat.nameBn,
                nameIt: cat.nameIt,
                slug: c.slug,
              };
            }),
          };
          subChildArray.push(obj);
        }

        const obj = {
          _id: cat._id,
          name: cat.name,
          nameBn: cat.nameBn,
          nameIt: cat.nameIt,
          mobileImage: cat.mobileImage,
          image: cat.image,
          slug: cat.slug,
          subCategories: subChildArray,
        };

        data.push(obj);
      }

      return {
        success: true,
        message: 'Success',
        data: data,
      } as ResponsePayload;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * updateChildCategoryById
   * updateMultipleChildCategoryById
   */
  async updateChildCategoryById(
    id: string,
    updateChildCategoryDto: UpdateChildCategoryDto,
  ): Promise<ResponsePayload> {
    const { name } = updateChildCategoryDto;
    let data;
    try {
      data = await this.childCategoryModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    try {
      const finalData = { ...updateChildCategoryDto };
      // Check Slug
      if (name)
        if (name && data.name !== name) {
          finalData.slug = this.utilsService.transformToSlug(name, true);
        }

      await this.childCategoryModel.findByIdAndUpdate(id, {
        $set: finalData,
      });
      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateMultipleChildCategoryById(
    ids: string[],
    updateChildCategoryDto: UpdateChildCategoryDto,
  ): Promise<ResponsePayload> {
    const mIds = ids.map((m) => new ObjectId(m));

    // Delete No Multiple Action Data
    if (updateChildCategoryDto.slug) {
      delete updateChildCategoryDto.slug;
    }

    try {
      await this.childCategoryModel.updateMany(
        { _id: { $in: mIds } },
        { $set: updateChildCategoryDto },
      );

      return {
        success: true,
        message: 'Success',
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async changeMultipleChildCategoryStatus(
    ids: string[],
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponsePayload> {
    const { status } = updateCategoryDto;

    const mIds = ids.map((m) => new ObjectId(m));

    try {
      await this.childCategoryModel.updateMany(
        { _id: { $in: mIds } },
        { $set: { status: status } },
      );

      await this.productModel.updateMany(
        { 'category._id': { $in: mIds } },
        { $set: { status: status } },
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
   * deleteChildCategoryById
   * deleteMultipleChildCategoryById
   */
  async deleteChildCategoryById(
    id: string,
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    let data;
    try {
      data = await this.childCategoryModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!data) {
      throw new NotFoundException('No Data found!');
    }
    if (data.readOnly) {
      throw new NotFoundException('Sorry! Read only data can not be deleted');
    }
    try {
      await this.childCategoryModel.findByIdAndDelete(id);
      // Reset Product Child Category Reference
      if (checkUsage) {
        const defaultChildCategory = await this.childCategoryModel.findOne({
          readOnly: true,
        });
        const resetCategory = {
          childCategory: {
            _id: defaultChildCategory._id,
            name: defaultChildCategory.name,
            slug: defaultChildCategory.slug,
          },
        };
        // Update Product
        await this.productModel.updateMany(
          { 'childCategory._id': new ObjectId(id) },
          { $set: resetCategory },
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

  async deleteMultipleChildCategoryById(
    ids: string[],
    checkUsage: boolean,
  ): Promise<ResponsePayload> {
    try {
      const mIds = ids.map((m) => new ObjectId(m));
      // Remove Read Only Data
      const allCategory = await this.childCategoryModel.find({
        _id: { $in: mIds },
      });
      const filteredIds = allCategory
        .filter((f) => f.readOnly !== true)
        .map((m) => m._id);
      await this.childCategoryModel.deleteMany({ _id: filteredIds });

      // Reset Product Category Reference
      if (checkUsage) {
        const defaultChildCategory = await this.childCategoryModel.findOne({
          readOnly: true,
        });
        const resetCategory = {
          childCategory: {
            _id: defaultChildCategory._id,
            name: defaultChildCategory.name,
            slug: defaultChildCategory.slug,
          },
        };
        // Update Product
        await this.productModel.updateMany(
          { 'childCategory._id': { $in: mIds } },
          { $set: resetCategory },
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
