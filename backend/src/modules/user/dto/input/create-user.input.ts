import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { ROLES } from '../../../../ENUM/ENUMS';

@InputType()
export class CreateUserInput {
  @Field(() => ROLES, { description: 'Role of the User' })
  @IsString()
  role: ROLES;

  @Field(() => ID, { description: 'Cognito ID' })
  @IsUUID()
  uuid: string;

  @Field(() => ID, { description: 'ID of Person' })
  @IsUUID()
  fk: string;
}
