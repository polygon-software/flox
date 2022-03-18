import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsInt } from 'class-validator';

@ArgsType()
export class GetLogFileArgs {
  @Field(() => String)
  @IsArray()
  cli: string;
}
