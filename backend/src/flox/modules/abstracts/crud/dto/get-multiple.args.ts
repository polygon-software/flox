import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@ArgsType()
export default class GetMultipleArgs {
  @Field(() => [ID], { nullable: true })
  @IsArray()
  uuids: string[] = [];
}
