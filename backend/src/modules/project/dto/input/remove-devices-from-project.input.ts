import { Field, InputType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { Device } from '../../../../types/Device';

@InputType()
/**
 * Input for removing devices from their associated project(s)
 */
export class RemoveDevicesFromProjectInput {
  @Field(() => [Device], { description: 'MR2000 instances', nullable: true })
  @IsArray()
  devices: Device[];
}
