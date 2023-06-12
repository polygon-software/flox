import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import UpdateJobInput from '../../../job/dto/input/update-job.input';
import UpdateClientInput from '../../../client/dto/input/update-client.input';
import UpdateTenantInput from '../../../tenant/dto/input/update-tenant.input';
import UpdateBillingInput from '../../../billing/dto/input/update-billing.input';
import UpdateDeviceInput from '../../../device/dto/input/update-device.input';
import UpdateArticleInput from '../../../article/dto/input/update-article.input';
import UpdateExpenseInput from '../../../expense/dto/input/update-expense.input';
import CreateInput from '../../../../flox/modules/abstracts/crud/dto/input/create.input';
import UpdateImageFileInput from '../../../image-file/dto/input/update-image-file.input';

@InputType()
export default class CreateFormInput extends CreateInput {
  @Field(() => UpdateJobInput, {
    description: 'Job details',
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  job: UpdateJobInput;

  @Field(() => Date, {
    description: 'Date the form is created',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  startDate: Date;

  @Field(() => Date, {
    description: 'Date the form is resolved',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  endDate: Date;

  @Field(() => String, { description: 'Internal order number', nullable: true })
  @IsString()
  @IsOptional()
  internalOrderNumber: string;

  @Field(() => String, { description: 'External order number', nullable: true })
  @IsString()
  @IsOptional()
  externalOrderNumber: string;

  @Field(() => UpdateClientInput, {
    description: 'Client',
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  client: UpdateClientInput;

  @Field(() => String, { description: 'Owner', nullable: true })
  @IsString()
  @IsOptional()
  owner: string;

  @Field(() => String, { description: 'Object number', nullable: true })
  @IsString()
  @IsOptional()
  objectNumber: string;

  @Field(() => UpdateTenantInput, {
    description: 'Tenant',
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  tenant: UpdateTenantInput;

  @Field(() => Boolean, {
    description: 'Whether the measured voltage and power (NIV) is correct',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  measurePower: boolean;

  @Field(() => UpdateBillingInput, {
    description: 'Billing',
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  billing: UpdateBillingInput;

  @Field(() => String, { description: 'Problem description', nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => [UpdateDeviceInput], {
    description: 'Devices',
    nullable: true,
  })
  @IsArray()
  @IsOptional()
  devices: UpdateDeviceInput[];

  @Field(() => Date, {
    description: 'Protocol date',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  protocolDate: Date;

  @Field(() => String, { description: 'Protocol text', nullable: true })
  @IsString()
  @IsOptional()
  protocolText: string;

  @Field(() => [UpdateArticleInput], {
    description: 'Articles',
    nullable: true,
  })
  @IsArray()
  @IsOptional()
  articles: UpdateArticleInput[];

  @Field(() => [UpdateExpenseInput], {
    description: 'Expenses',
    nullable: true,
  })
  @IsArray()
  @IsOptional()
  expenses: UpdateExpenseInput[];

  @Field(() => Number, {
    description: 'Total cost of the job',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  totalAmount: number;

  @Field(() => String, { description: "Employee's ID", nullable: true })
  @IsString()
  @IsOptional()
  employeeId: string;

  @Field(() => String, { description: 'Additional text', nullable: true })
  @IsString()
  @IsOptional()
  freeText: string;

  @Field(() => Boolean, {
    description: 'Whether the job is an emergency',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  isEmergency: boolean;

  @Field(() => [UpdateImageFileInput], {
    description: 'Images',
    nullable: true,
  })
  @IsArray()
  @IsOptional()
  images: UpdateImageFileInput[];
}
