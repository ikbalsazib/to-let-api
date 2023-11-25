import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { PaymentService } from './payment.service';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';

@Controller('payment')
export class PaymentController {
  private logger = new Logger(PaymentController.name);

  constructor(private paymentService: PaymentService) {}

  /**
   * STRIPE PAYMENT
   * createStripePaymentSession()
   */
  @Post('/stripe-create-payment')
  @UsePipes(ValidationPipe)
  async createStripePaymentSession(
    @Body() data: any,
  ): Promise<ResponsePayload> {
    //console.log('otp phone', addOtpDto);
    return await this.paymentService.createStripePaymentSession(data);
  }

  @Post('/check-stripe-session')
  @UsePipes(ValidationPipe)
  async checkoutSession(
    @Body() data: { sessionId: string },
  ): Promise<ResponsePayload> {
    return await this.paymentService.checkoutSession(data.sessionId);
  }
}
