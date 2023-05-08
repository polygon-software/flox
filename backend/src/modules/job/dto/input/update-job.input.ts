import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

import CreateJobInput from './create-job.input';

@InputType()
export default class UpdateJobInput extends PartialType(CreateJobInput) {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
