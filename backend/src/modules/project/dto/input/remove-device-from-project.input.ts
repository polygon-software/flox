import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
/**
 * Input for removing a device from its associated project
 */
export class RemoveDeviceFromProjectInput {
  @Field(() => String, {
    description: 'Project name',
  })
  @IsString()
  name: string;

  @Field(() => String, {
    description: 'Device client',
    nullable: true,
  })
  @IsString()
  cli: string;
}
