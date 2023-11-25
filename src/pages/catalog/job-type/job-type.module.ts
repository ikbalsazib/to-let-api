import { Module } from '@nestjs/common';
import { JobTypeService } from './job-type.service';
import { JobTypeController } from './job-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobTypeSchema } from '../../../schema/jobType.schema';
import { ProductSchema } from '../../../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'JobType', schema: JobTypeSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [JobTypeService],
  controllers: [JobTypeController],
})
export class JobTypeModule {}
