import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin } from '../../interfaces/admin/admin.interface';
import { User } from '../../interfaces/user/user.interface';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Product } from '../../interfaces/common/product.interface';
import { ErrorCodes } from '../../enum/error-code.enum';

const ObjectId = Types.ObjectId;

@Injectable()
export class DashboardService {
  private logger = new Logger(DashboardService.name);

  constructor(
    @InjectModel('Admin')
    private readonly adminModel: Model<Admin>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  async getPostCount(): Promise<ResponsePayload> {
    try {
      const matrimonial = await this.productModel.countDocuments({
        postType: 'matrimonial',
      });

      const job = await this.productModel.countDocuments({
        postType: 'job_post',
      });

      const products = await this.productModel.countDocuments({
        postType: 'products',
      });

      const toLet = await this.productModel.countDocuments({
        postType: 'to_let',
      });

      return {
        data: {
          matrimonial,
          products,
          toLet,
          job,
        },
        success: true,
        message: 'Success',
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
}
