import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { PERMISSION } from '../../../../ENUM/ENUM';

@InputType()
/**
 * Input for adding permissions to a user
 */
export class AddUserPermissionInput {
  @Field(() => ID, { description: 'User UUID' })
  @IsUUID()
  uuid: string;

  @Field(() => String, { description: 'Name of the permitted resource' })
  @IsString()
  resource: string;

  @Field(() => PERMISSION, { description: 'Permission Type' })
  @IsString()
  type: PERMISSION;
}
