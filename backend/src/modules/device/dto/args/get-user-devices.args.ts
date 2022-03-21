import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsUUID } from 'class-validator';

@ArgsType()
export class GetUserDevicesArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  // Whether to return only devices that are not assigned to a project
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  unassigned: boolean;

  // Whether to return only devices that are assigned to a project
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  assigned: boolean;
}
