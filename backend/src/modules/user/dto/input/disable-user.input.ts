import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { ROLE } from '../../../../ENUM/ENUMS';

@InputType()
export class DisableUserInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => ROLE, { description: 'Role of the User' })
  @IsString()
  role: ROLE;
}
