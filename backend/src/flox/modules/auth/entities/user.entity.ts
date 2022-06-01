import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { IsEmail, IsString } from 'class-validator';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String, { description: 'Username' })
  @Column()
  @IsString()
  username: string;

  @Field(() => String, { description: 'E-mail address' })
  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Cognito UUID' })
  @Column()
  @IsString()
  cognitoUuid: string;

  @Field(() => String, { description: 'User role', nullable: true })
  @Column()
  @IsString()
  role: string;
}
