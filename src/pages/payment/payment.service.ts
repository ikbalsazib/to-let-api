import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsService } from '../../shared/utils/utils.service';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { Order } from '../../interfaces/common/order.interface';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private logger = new Logger(PaymentService.name);
  private stripe: Stripe;

  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<Order>,
    private utilsService: UtilsService,
    private configService: ConfigService,
    private http: HttpService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  /**
   * STRIPE Payment
   * createStripePaymentSession()
   */
  async createStripePaymentSession(data: any): Promise<ResponsePayload> {
    try {
      console.log('data', data);
      const metaData = {
        // name: data[0].name,
        // images: data[0].images,
        description: data[0].description,
        // category: data[0].category,
        date: `${Date.now()}`,
      };

      const line_items = data.map((m) => {
        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: m.name,
              images: m.images,
              description: m.description,
            },
            unit_amount: m.amount * 100,
          },
          quantity: 1,
        };
      });

      const redirectUrl = this.configService.get<string>('STRIPE_REDIRECT_URL');

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: line_items,
        // customer: customer.id,
        success_url: `${redirectUrl}/payment/check-stripe-payment/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${redirectUrl}/payment/check-stripe-payment/?session_id={CHECKOUT_SESSION_ID}`,
        metadata: metaData,
      });

      return {
        success: true,
        message: 'Success!',
        data: session,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkoutSession(sessionId: string): Promise<ResponsePayload> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      const mSession = JSON.parse(JSON.stringify(session));
      const data = {
        paymentStatus: mSession.payment_status,
        amount: mSession.amount_total,
      };

      if (data.paymentStatus === 'paid') {
        await this.orderModel.findOneAndUpdate(
          { stripPaymentId: sessionId },
          {
            paymentStatus: 'paid',
          },
        );
      } else {
        await this.orderModel.deleteOne({ stripPaymentId: sessionId });
      }

      return {
        success: true,
        message: 'Success!',
        data: data,
      } as ResponsePayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
