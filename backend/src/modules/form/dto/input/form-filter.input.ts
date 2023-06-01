import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsObject, IsOptional } from 'class-validator';

import FilterInput from '../../../../flox/modules/abstracts/search/dto/input/filter.input';

import JobFilterInput from './job-filter.input';

@InputType()
export default class FormFilterInput extends FilterInput {
  @Field(() => JobFilterInput, {
    description: 'Job filter',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  job?: JobFilterInput;

  @Field(() => Date, {
    description: 'Date the form is created',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @Field(() => Date, {
    description: 'Date the form is resolved',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => Date, {
    description: 'Last time the form was pulled by ERP',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  pulledAt?: Date;

  @Field(() => Boolean, {
    description: 'Whether the job is an emergency',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean;

  @Field(() => Boolean, {
    description: 'Whether the job is finished',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  isFinished?: boolean;
}
