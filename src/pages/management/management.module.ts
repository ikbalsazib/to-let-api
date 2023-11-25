import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagementSchema } from '../../schema/management.schema';
import { UserSchema } from '../../schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Management', schema: ManagementSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [ManagementService],
  controllers: [ManagementController],
})
export class ManagementModule {}  
