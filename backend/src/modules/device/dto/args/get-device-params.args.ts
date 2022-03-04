import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsDate, IsInt } from 'class-validator';

@ArgsType()
export class GetDeviceParamsArgs {
  @Field(() => String)
  @IsArray()
  stationId: string;
}
