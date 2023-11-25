import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../../shared/utils/utils.service';
import { Reward } from '../../interfaces/common/reward.interface';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { ErrorCodes } from '../../enum/error-code.enum';
import { AddRewardDto } from '../../dto/reward.dto';

const ObjectId = Types.ObjectId;

@Injectable()
export class RewardService {
  private logger = new Logger(RewardService.name);

  constructor(
    @InjectModel('Reward')
    private readonly shippingChargeModel: Model<Reward>,
    private configService: ConfigService,
    private utilsService: UtilsService,
  ) {}

  /**
   * addReward
   * insertManyReward
   */
  async addReward(addRewardDto: AddRewardDto): Promise<ResponsePayload> {
    try {
      const shippingChargeData = await this.shippingChargeModel.findOne();
      if (shippingChargeData) {
        await this.shippingChargeModel.findByIdAndUpdate(
          shippingChargeData._id,
          {
            $set: addRewardDto,
          },
        );
        const data = {
          _id: shippingChargeData._id,
        };

        return {
          success: true,
          message: 'Data Updated Success',
          data,
        } as ResponsePayload;
      } else {
        const newData = new this.shippingChargeModel(addRewardDto);
        const saveData = await newData.save();
        const data = {
          _id: saveData._id,
        };

        return {
          success: true,
          message: 'Data Added Success',
          data,
        } as ResponsePayload;
      }
    } catch (error) {
      console.log(error);
      if (error.code && error.code.toString() === ErrorCodes.UNIQUE_FIELD) {
        throw new ConflictException('Slug Must be Unique');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * getReward
   * getRewardById
   */

  async getReward(select: string): Promise<ResponsePayload> {
    try {
      const data = await this.shippingChargeModel.findOne({}).select(select);
      return {
        success: true,
        message: 'Success',
        data,
      } as ResponsePayload;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
