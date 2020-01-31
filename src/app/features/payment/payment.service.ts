import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Stripe } from 'stripe';

import { CardList } from '@models';
import { StripeService } from '@shared/stripe';
import { PrismaService } from '@shared/prisma';

@Injectable()
export class PaymentService {
  constructor(private readonly stripe: StripeService, private readonly prisma: PrismaService) {}

  public async getSources(customerID: string) {
    try {
      const { data, has_more } = await this.stripe.customers.listSources(customerID, {
        object: 'card',
      });

      // Stripe's Typing is very weak right now, hopefully in an update or two this any can be removed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { default_source } = (await this.stripe.customers.retrieve(customerID)) as any;
      return { default_source, data, has_more };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async getSource(customerID: string, source: string) {
    try {
      return this.stripe.customers.retrieveSource(customerID, source);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async addSource(customerID: string, source: string) {
    try {
      return this.stripe.customers.createSource(customerID, { source });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async deleteSource(customerID: string, source: string) {
    try {
      await this.stripe.customers.deleteSource(customerID, source);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async updateDefaultSource(customerID: string, default_source: string) {
    try {
      await this.stripe.customers.update(customerID, { default_source });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async addSubscription(customer: string, plan: string, id: number) {
    try {
      await this.stripe.subscriptions.create({
        customer,
        items: [{ plan }],
        expand: ['latest_invoice.payment_intent'],
      });
      this.prisma.children.update({ data: { subscription: true }, where: { id } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async verifyChild(id: number, childID: number) {
    const foundChild = await this.prisma.parents
      .findOne({ where: { id } })
      .children({ where: { id: childID } });
    if (!foundChild) throw new NotFoundException();
    return !!foundChild;
  }
}
