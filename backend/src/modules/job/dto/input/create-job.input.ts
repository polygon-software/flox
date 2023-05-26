import { InputType, Field } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

import { JOB_STATUS, JOB_TYPE } from '../../../../ENUM/enum';

@InputType()
export default class CreateJobInput {
  @Field(() => JOB_TYPE, { description: 'Job type' })
  @IsEnum(JOB_TYPE)
  type: JOB_TYPE;

  @Field(() => JOB_STATUS, { description: 'Job status' })
  @IsEnum(JOB_STATUS)
  status: JOB_STATUS;
}
