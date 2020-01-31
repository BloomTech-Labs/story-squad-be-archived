import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService extends Stripe {
  constructor() {
    super(process.env.STRIPE_KEY, {
      apiVersion: '2019-12-03',
      typescript: true,
    });
  }
}
