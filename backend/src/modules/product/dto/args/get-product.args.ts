import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetProductArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
