import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export default class GetAllFoldersArgs {
  @Field(() => String, {
    description: 'Path at start of folder',
  })
  @IsString()
  path: string;
}
