import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsDate, IsInt } from 'class-validator';

@ArgsType()
export class GetLevelWritingArgs {
  @Field(() => [String])
  @IsArray()
  stationIds: string[];

  @Field(() => Date)
  @IsDate()
  start: Date;

  @Field(() => Date)
  @IsDate()
  end: Date;

  @Field(() => Int)
  @IsInt()
  resolution: number;
}
