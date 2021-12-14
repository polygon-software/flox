import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetCompanyArgs {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  uuid: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  cognito_id: string;
}
