import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectStripe } from 'nestjs-stripe';

import User from '../auth/entities/user.entity';
import AbstractSearchService from '../abstracts/search/abstract-search.service';

import Payment from './entities/payment.entity';
import PaymentIntentOutput from './dto/output/payment-intent.output';

import type { Stripe } from 'stripe';

@Injectable()
export default class PaymentService extends AbstractSearchService<Payment> {
  constructor(
    @InjectStripe()
    private readonly stripe: Stripe,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    super();
  }

  /**
   * @returns article repository
   */
  get repository(): Repository<Payment> {
    return this.paymentRepository;
  }

  /**
   * Returns a payment
   *
   * @param uuid - uuid of payment
   * @returns payment
   */
  async getPayment(uuid: string): Promise<Payment> {
    const paymentEntity = await this.paymentRepository.findOneOrFail({
      where: {
        uuid,
      },
      relations: {
        buyer: true,
      },
    });
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentEntity.intentId,
    );
    return this.update(
      {
        ...paymentEntity,
        ...{
          status: paymentIntent.status,
          paid: paymentIntent.status === 'succeeded',
        },
      },
      {
        relations: {
          buyer: true,
        },
      },
    );
  }

  /**
   * Returns a stripe customer based on a user object
   *
   * @param user - user object
   * @returns stripe customer object
   */
  async getCustomer(user: User): Promise<Stripe.Customer | undefined> {
    const { data: customers } = await this.stripe.customers.search({
      query: `metadata['uuid']:'${user.uuid}'`,
    });
    return customers[0];
  }

  /**
   * Creates a stripe customer based on a user object
   *
   * @param user - user object
   * @returns stripe customer object
   */
  async createCustomer(user: User): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email: user.email,
      metadata: {
        uuid: user.uuid,
      },
    });
  }

  /**
   * Creates stripe payment intent for a given value
   *
   * @param buyer - user who buys item
   * @param amount - value of payment
   * @param description - description of purchase
   * @param currency - currency of payment
   * @returns payment intent
   */
  async initiatePayment(
    buyer: User,
    amount: number,
    description: string,
    currency = 'chf',
  ): Promise<PaymentIntentOutput> {
    let customer: Stripe.Customer | undefined = await this.getCustomer(buyer);
    if (!customer) {
      customer = await this.createCustomer(buyer);
    }
    const intent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Stripe accepts the minimum divisiable currency unit. Hence, cents, not dollars etc.
      currency,
      description,
      customer: customer.id,
      // eslint-disable-next-line camelcase
      automatic_payment_methods: {
        enabled: true,
      },
    });
    if (!intent.client_secret) {
      throw new Error('Invalid payment intent');
    }
    const paymentEntity = await super.create({
      paid: false,
      status: 'requires_payment_method',
      secret: intent.client_secret,
      intentId: intent.id,
      description,
      amount,
      currency,
      buyer,
    });
    await this.stripe.paymentIntents.update(intent.id, {
      metadata: {
        uuid: paymentEntity.uuid,
      },
    });
    return {
      uuid: paymentEntity.uuid,
      amount,
      currency,
      description,
      secret: intent.client_secret,
      status: intent.status,
    };
  }
}
