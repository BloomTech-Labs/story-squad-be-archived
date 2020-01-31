import { Stripe } from 'stripe';

export class CardList {
  public default_source: string;
  public data: Stripe.CustomerSource[];
  public has_more: boolean;
}
