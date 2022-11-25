import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Payment from './entities/payment.entity';
import PaymentService from './payment.service';
import PaymentResolver from './payment.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService, PaymentResolver],
})
export default class PaymentModule {}
