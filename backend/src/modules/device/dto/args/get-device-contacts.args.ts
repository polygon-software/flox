import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetDeviceContactsArgs {
  @Field(() => String)
  cli: string;
}
