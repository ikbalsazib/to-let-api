import { Module } from '@nestjs/common';
import { ChildCategoryController } from './child-category.controller';
import { ChildCategoryService } from './child-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategorySchema } from '../../../schema/sub-category.schema';
import { ProductSchema } from '../../../schema/product.schema';
import { ChildCategorySchema } from '../../../schema/child-category.schema';
import { CategorySchema } from '../../../schema/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'SubCategory', schema: SubCategorySchema },
      { name: 'ChildCategory', schema: ChildCategorySchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  controllers: [ChildCategoryController],
  providers: [ChildCategoryService],
})
export class ChildCategoryModule {}
