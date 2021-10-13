import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetUserArgs {
  @Field(() => ID)
  @IsUUID()
  userId: string;
}
