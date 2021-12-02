import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsString, IsUUID } from 'class-validator';

@ObjectType()
@Entity({ name: 'user' })
export class User {
  @Field(() => String, { description: 'Role of the User' })
  @Column()
  @IsString()
  role: string;

  @Field(() => ID, { description: 'Cognito ID' })
  @IsUUID()
  uuid: string;

  @Field(() => ID, { description: 'UUID of the specific entity' })
  @IsUUID()
  fk: string;
}
