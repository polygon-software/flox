import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetFileArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
