import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsString, IsUUID } from 'class-validator';
import { ROLES, STATUS } from '../../ENUM/ENUMS';

@ObjectType()
@Entity({ name: 'user' })
export class User {
  @Field(() => ROLES, { description: 'Role of the User' })
  @Column({
    type: 'enum',
    enum: ROLES,
    default: ROLES.NONE,
  })
  @IsString()
  role: ROLES;

  @Field(() => ID, { description: 'Cognito ID' })
  @IsUUID()
  uuid: string;

  @Field(() => ID, { description: 'UUID of the specific entity' })
  @IsUUID()
  fk: string;
}
