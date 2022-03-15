import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@ArgsType()
export class GetDeviceContactsArgs {
  @Field(() => String)
  cli: string;
}
