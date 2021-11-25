import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

@ObjectType()
export class Employee extends Person {
  @Column()
  @Field(() => String, { description: 'Language' })
  @IsString()
  language: string;

  @Column()
  @Field(() => String, { description: 'Function within the company' })
  @IsString()
  function: string;

  @Column()
  @Field(() => String, { description: 'E-mail' })
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  @Field(() => String, { description: 'Phone Number' })
  @IsString()
  @IsPhoneNumber()
  phone: string;
}
