import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactRequestSchema } from 'src/schema/contact-request.schema';
import { ProductSchema } from '../../schema/product.schema';
import { ContactRequestController } from './contact-request.controller';
import { ContactRequestService } from './contact-request.service';
import {UserSchema} from '../../schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ContactRequest', schema: ContactRequestSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ContactRequestController],
  providers: [ContactRequestService],
})
export class ContactRequestModule {}
