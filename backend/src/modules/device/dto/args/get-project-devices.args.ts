import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class GetProjectDevicesArgs {
  @Field(() => String)
  @IsString()
  name: string;
}
