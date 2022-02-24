import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsUUID } from 'class-validator';

@ArgsType()
export class GetMyDevicesArgs {
  // Whether to return only devices that are not assigned to a project
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  unassigned: boolean;
}
