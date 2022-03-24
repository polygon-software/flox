import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@ArgsType()
export class GetMultipleDeviceParamsArgs {
  @Field(() => [String])
  @IsArray()
  clis: string[];
}
