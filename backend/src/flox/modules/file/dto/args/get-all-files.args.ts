import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetAllFilesArgs {
  @Field(() => Int, {
    defaultValue: 500,
    description: 'Number of files to load',
  })
  limit = 500;

  @Field(() => Int, {
    defaultValue: 0,
    description: 'How many files to skip',
  })
  skip = 0;
}
