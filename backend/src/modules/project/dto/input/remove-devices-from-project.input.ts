import { Field, InputType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { MR2000 } from '../../../../types/MR2000';
import { MR3000 } from '../../../../types/MR3000';

@InputType()
/**
 * Input for removing devices from their associated project(s)
 */
export class RemoveDevicesFromProjectInput {
  @Field(() => [MR2000], { description: 'MR2000 instances', nullable: true })
  @IsArray()
  mr2000Instances: MR2000[];

  @Field(() => [MR3000], { description: 'MR3000 instances', nullable: true })
  @IsArray()
  mr3000Instances: MR3000[];
}
