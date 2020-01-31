import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { Stripe } from 'stripe';

import { Parent, CardList, AddCardDTO } from '@models';
import { User } from '@shared/common';

import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/cards')
  public async getCards(@User('parent') { stripeID }: Parent): Promise<CardList> {
    return await this.paymentService.getSources(stripeID);
  }

  @Get('/cards/:id')
  public async getCard(
    @User('parent') { stripeID }: Parent,
    @Param('id') id: string
  ): Promise<Stripe.CustomerSource> {
    return await this.paymentService.getSource(stripeID, id);
  }

  @Post('/cards')
  public async addCard(
    @User('parent') { stripeID }: Parent,
    @Body() { id }: AddCardDTO
  ): Promise<Stripe.CustomerSource> {
    return await this.paymentService.addSource(stripeID, id);
  }

  @Delete('/cards/:id')
  public async deleteCard(
    @User('parent') { stripeID }: Parent,
    @Param('id') id: string
  ): Promise<void> {
    await this.paymentService.deleteSource(stripeID, id);
  }

  @Put('/cards/:id/default')
  public async changeDefaultCard(
    @User('parent') { stripeID }: Parent,
    @Param('id') id: string
  ): Promise<void> {
    await this.paymentService.updateDefaultSource(stripeID, id);
  }

  @Post('/subscribe/:child/:plan')
  public async createSubscription(
    @User('parent') { id, stripeID }: Parent,
    @Param('child', ParseIntPipe) childID: number,
    @Param('plan') plan: string
  ): Promise<void> {
    await this.paymentService.verifyChild(id, childID);
    await this.paymentService.addSubscription(stripeID, plan, childID);
  }
}
