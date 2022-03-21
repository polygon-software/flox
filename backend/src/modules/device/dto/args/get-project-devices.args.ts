import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@ArgsType()
export class GetProjectDevicesArgs {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  uuid: string;

  @Field(() => String, { nullable: true })
  @IsString()
  name: string;
}
