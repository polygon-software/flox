import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { JOB_STATUS, JOB_TYPE } from '../../../../ENUM/enum';
import FilterInput from '../../../../flox/modules/abstracts/search/dto/input/filter.input';

@InputType()
export default class JobFilterInput extends FilterInput {
  @Field(() => JOB_TYPE, {
    description: 'Job type',
    nullable: true,
  })
  @IsEnum(JOB_TYPE)
  @IsOptional()
  type?: JOB_TYPE;

  @Field(() => JOB_STATUS, {
    description: 'Job status',
    nullable: true,
  })
  @IsEnum(JOB_STATUS)
  @IsOptional()
  status?: JOB_STATUS;
}
