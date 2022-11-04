import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export default class GetOneArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
