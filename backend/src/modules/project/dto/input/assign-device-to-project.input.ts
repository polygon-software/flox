import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import { MR2000 } from '../../../../types/MR2000';
import { MR3000 } from '../../../../types/MR3000';

@InputType()
/**
 * Input for associating a device to a project
 */
export class AssignDeviceToProjectInput {
  @Field(() => ID, {
    description: 'Project UUID',
  })
  @IsArray()
  uuid: string;

  @Field(() => String, {
    description: 'Device CLI',
    nullable: true,
  })
  @IsString()
  cli: string;
}
