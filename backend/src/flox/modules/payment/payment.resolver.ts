import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-express';

import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import User from '../auth/entities/user.entity';
import { LoggedIn } from '../auth/authentication.decorator';
import GetOneArgs from '../abstracts/crud/dto/get-one.args';
import { DefaultRoles } from '../roles/config';

import Payment from './entities/payment.entity';
import PaymentService from './payment.service';
import PaymentIntentOutput from './dto/outputs/payment-intent.output';

@Resolver(() => Payment)
export default class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Returns a payment object
   *
   * @param getOneArgs - contains payment uuid
   * @param user - user that requests the payment
   * @returns payment
   */
  @LoggedIn()
  @Query(() => Payment, { name: 'Payment' })
  async getPayment(
    @Args() getOneArgs: GetOneArgs,
    @CurrentUser() user: User,
  ): Promise<Payment> {
    const payment = await this.paymentService.getPayment(getOneArgs.uuid);
    if (
      !(user.role === DefaultRoles.ADMIN || payment.buyer.uuid !== user.uuid)
    ) {
      throw new ForbiddenError('User not allowed to request payment');
    }
    return payment;
  }

  /**
   * Creates a test payment of 1 CHF
   *
   * @param user - logged in admin user that tests payment
   * @returns payment intent
   */
  @AdminOnly()
  @Mutation(() => PaymentIntentOutput, { name: 'TestPayment' })
  createTestPayment(@CurrentUser() user: User): Promise<PaymentIntentOutput> {
    return this.paymentService.initiatePayment(user, 1, 'Test Payment');
  }
}
