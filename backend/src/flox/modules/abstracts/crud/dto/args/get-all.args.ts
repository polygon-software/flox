import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@ArgsType()
export default class GetAllArgs {
  @Field(() => Int, {
    defaultValue: 500,
    description: 'Number of items to load',
  })
  @IsInt()
  @Min(1)
  @Max(500)
  take = 500;

  @Field(() => Int, {
    defaultValue: 0,
    description: 'How many items to skip',
  })
  @IsInt()
  @Min(0)
  skip = 0;
}
