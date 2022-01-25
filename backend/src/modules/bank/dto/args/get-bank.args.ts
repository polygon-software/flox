import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetBankArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
