import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsOptional, IsUUID } from 'class-validator';

import CreateFormInput from './create-form.input';

@InputType()
export default class UpdateFormInput extends PartialType(CreateFormInput) {
  @Field(() => ID, { description: 'Form UUID', nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;

  @Field(() => Boolean, {
    description: 'Whether the form can be pulled by ERP',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  isPullable: boolean;

  @Field(() => Boolean, {
    description: 'Whether the job is finished',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  isFinished: boolean;

  @Field(() => Date, {
    description: 'Last time the form was pulled by ERP',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  pulledAt: Date;
}
