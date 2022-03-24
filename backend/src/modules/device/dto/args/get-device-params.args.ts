import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class GetDeviceParamsArgs {
  @Field(() => String)
  @IsString()
  cli: string;
}
