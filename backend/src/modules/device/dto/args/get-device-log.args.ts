import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@ArgsType()
export class GetDeviceLogArgs {
  @Field(() => String)
  @IsString()
  cli: string;

  @Field(() => Int)
  @IsInt()
  take: number;

  @Field(() => Int)
  @IsInt()
  skip: number;

  @Field(() => String, {
    nullable: true,
    description:
      "Optional file name prefix (e.g. 'REST' for REST logs), this applies only to MR3000 devices",
  })
  @IsString()
  prefix: string;
}
