import { Stripe } from 'stripe';

export class CardList {
  public default_source: string;
  public sources: Stripe.CustomerSource[];
  public has_more: boolean;
}
