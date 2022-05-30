import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { IsEmail, IsString } from 'class-validator';

@ObjectType()
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Field(() => String, { description: 'Name' })
  @Column()
  @IsString()
  name: string;

  @Field(() => String, { description: 'E-mail address' })
  @Column()
  @IsString()
  @IsEmail()
  email: string;
}
