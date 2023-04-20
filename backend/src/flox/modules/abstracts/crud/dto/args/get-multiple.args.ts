import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export default class GetMultipleArgs {
  @Field(() => [ID])
  @IsUUID(4, { each: true })
  uuids: string[] = [];
}
