import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { MR2000 } from '../../../../types/MR2000';
import { MR3000 } from '../../../../types/MR3000';

@InputType()
/**
 * Input for removing devices from their associated project(s)
 */
export class RemoveDevicesFromProjectInput {
  @Field(() => ID, {
    description: 'Project UUID',
  })
  @IsArray()
  uuid: string;

  @Field(() => [String], {
    description: 'MR2000 instance uuids',
    nullable: true,
  })
  @IsArray()
  mr2000instances: string[];

  @Field(() => [String], {
    description: 'MR3000 instance uuids',
    nullable: true,
  })
  @IsArray()
  mr3000instances: string[];
}
