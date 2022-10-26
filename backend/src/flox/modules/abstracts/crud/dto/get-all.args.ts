import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetAllArgs {
  @Field(() => Int, {
    defaultValue: 500,
    description: 'Number of items to load',
  })
  take = 500;

  @Field(() => Int, {
    defaultValue: 0,
    description: 'How many items to skip',
  })
  skip = 0;
}
