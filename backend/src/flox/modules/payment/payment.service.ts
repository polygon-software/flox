import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';

import AbstractCrudService from '../abstracts/crud/abstract-crud.service';
import User from '../auth/entities/user.entity';

import Payment from './entities/payment.entity';
import PaymentIntentOutput from './dto/outputs/payment-intent.output';

@Injectable()
export default class PaymentService extends AbstractCrudService<Payment> {
  /**
   * @returns article repository
   */
  get repository(): Repository<Payment> {
    return this.paymentRepository;
  }

  constructor(
    @InjectStripe()
    private readonly stripe: Stripe,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    super();
  }

  /**
   * Returns a payment
   *
   * @param uuid - uuid of payment
   * @returns payment
   */
  async getPayment(uuid: string): Promise<Payment> {
    return this.paymentRepository.findOneOrFail({
      where: {
        uuid,
      },
      relations: {
        buyer: true,
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
    const paymentEntity = await super.create({
      paid: false,
      description,
      amount,
      currency,
      buyer,
    });
    const intent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      description,
      // eslint-disable-next-line camelcase
      automatic_payment_methods: {
        enabled: true,
      },
    });
    if (!intent.client_secret) {
      throw new Error('Invalid payment intent');
    }
    return {
      uuid: paymentEntity.uuid,
      amount,
      currency,
      description,
      secret: intent.client_secret,
    };
  }
}
