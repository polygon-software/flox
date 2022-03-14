import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@ArgsType()
export class GetMyDevicesArgs {
  // Whether to return only devices that are not assigned to a project
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  unassigned: boolean;

  // Whether to return only devices that are assigned to a project
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  assigned: boolean;
}
