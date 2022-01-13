import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@ArgsType()
export class GetAnnouncementsArgs {
  @Field(() => [ID], { nullable: true })
  @IsArray()
  uuids: string[];
}
