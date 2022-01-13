import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetAnnouncementArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
