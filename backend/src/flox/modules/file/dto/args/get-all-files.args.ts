import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetAllFilesArgs {
  @Field(() => Number, {
    defaultValue: 500,
    description: 'Number of images to load',
  })
  limit = 500;

  @Field(() => Number, {
    defaultValue: 0,
    description: 'How many images to skip',
  })
  skip = 0;
}
