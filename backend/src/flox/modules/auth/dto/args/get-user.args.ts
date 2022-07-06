import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetUserArgs {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  uuid: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  cognitoUuid: string;
}
