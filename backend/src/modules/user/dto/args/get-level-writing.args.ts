import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@ArgsType()
export class GetLevelWritingArgs {
  @Field(() => [String])
  @IsString()
  stationIds: string[];

  @Field(() => Date)
  @IsInt()
  start: Date;

  @Field(() => Date)
  @IsInt()
  end: Date;

  @Field(() => Int)
  @IsInt()
  resolution: number;
}
