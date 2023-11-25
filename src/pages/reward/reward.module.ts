import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardSchema } from '../../schema/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reward', schema: RewardSchema }]),
  ],
  providers: [RewardService],
  controllers: [RewardController],
})
export class RewardModule {}
