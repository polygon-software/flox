import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
/**
 * Input for removing a device from its associated project
 */
export class RemoveDeviceFromProjectInput {
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
