import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Article from '../article/entities/article.entity';
import Billing from '../billing/entities/billing.entity';
import Client from '../client/entities/client.entity';
import Device from '../device/entities/device.entity';
import Expense from '../expense/entities/expense.entity';
import ImageFile from '../image/entities/image.entity';
import Job from '../job/entities/job.entity';
import Address from '../address/entities/address.entity';

import Form from './entities/form.entity';
import FormService from './form.service';
import FormResolver from './form.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Address,
      Article,
      Billing,
      Client,
      Device,
      Expense,
      Form,
      ImageFile,
      Job,
    ]),
  ],
  providers: [Form, FormResolver, FormService],
  exports: [FormResolver, FormService],
})
export default class FormModule {}
