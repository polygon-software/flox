import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsInt } from 'class-validator';

@ArgsType()
export class GetConnectionLogsArgs {
  @Field(() => String)
  @IsArray()
  cli: string;

  @Field(() => Int)
  @IsInt()
  take: number;

  @Field(() => Int)
  @IsInt()
  skip: number;
}
