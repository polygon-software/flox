import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsOptional, IsString, Matches } from 'class-validator';

import { PASSWORD_REGEX } from 'src/flox/REGEX';

import User from './user.entity';

/**
 * A helper class, used when an adminc creates a new user
 */
@ObjectType()
@Entity()
export default class NewUser extends User {
  @Field(() => String, { description: 'password', nullable: true })
  @Column()
  @IsString()
  @Matches(PASSWORD_REGEX)
  @IsOptional()
  password: string;
}
