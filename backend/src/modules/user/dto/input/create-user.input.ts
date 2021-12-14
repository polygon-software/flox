import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { ROLE } from '../../../../ENUM/ENUMS';

@InputType()
export class CreateUserInput {
  @Field(() => ROLE, { description: 'Role of the User' })
  @IsString()
  role: ROLE;

  @Field(() => ID, { description: 'Cognito ID' })
  @IsUUID()
  uuid: string;

  @Field(() => ID, { description: 'ID of Person' })
  @IsUUID()
  fk: string;
}
