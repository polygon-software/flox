import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@ArgsType()
export class GetDeviceDataArgs {
  @Field(() => String)
  @IsString()
  name: string;

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
