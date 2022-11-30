import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-express';
import { FindOneOptions } from 'typeorm';

import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import User from '../auth/entities/user.entity';
import { LoggedIn } from '../auth/authentication.decorator';
import GetOneArgs from '../abstracts/crud/dto/args/get-one.args';
import { DefaultRoles } from '../roles/config';
import AbstractSearchResolver from '../abstracts/search/abstract-search.resolver';
import SearchArgs from '../abstracts/search/dto/args/search.args';

import Payment from './entities/payment.entity';
import PaymentService from './payment.service';
import PaymentIntentOutput from './dto/output/payment-intent.output';
import PaymentSearchOutput from './dto/output/payment-search.output';

@Resolver(() => Payment)
export default class PaymentResolver extends AbstractSearchResolver<
  Payment,
  PaymentService
> {
  constructor(private readonly paymentService: PaymentService) {
    super(['status', 'description', 'buyer.username']);
  }

  /**
   * @returns payment service
   */
  get service(): PaymentService {
    return this.paymentService;
  }

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

  /**
   * Queries for all rows that fit query criteria, best used in combination with the DataTable
   *
   * @param queryArgs - contain table filtering rules
   * @param user - logged in user
   * @returns data that fit criteria
   */
  @LoggedIn()
  @Query(() => PaymentSearchOutput, { name: 'SearchPayments' })
  searchPayments(
    @Args() queryArgs: SearchArgs,
    @CurrentUser() user: User,
  ): Promise<PaymentSearchOutput> {
    const options: FindOneOptions<Payment> = {
      relations: {
        buyer: true,
      },
    };
    if (user.role !== DefaultRoles.ADMIN) {
      options.where = {
        buyer: {
          uuid: user.uuid,
        },
      };
    }
    return super.search(queryArgs, options);
  }
}
