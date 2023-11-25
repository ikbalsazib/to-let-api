import { Global, Module } from '@nestjs/common';
import { BulkSmsService } from './bulk-sms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule, MongooseModule.forFeature([])],
  providers: [BulkSmsService],
  exports: [BulkSmsService],
})
export class BulkSmsModule {}
