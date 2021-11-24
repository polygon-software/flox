import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetPublicFileArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
