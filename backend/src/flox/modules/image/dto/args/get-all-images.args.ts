import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetAllImagesArgs {
  @Field(() => Int, {
    defaultValue: 500,
    description: 'Number of images to load',
  })
  take = 500;

  @Field(() => Int, {
    defaultValue: 0,
    description: 'How many images to skip',
  })
  skip = 0;
}
