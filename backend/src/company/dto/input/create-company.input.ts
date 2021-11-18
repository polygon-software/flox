import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Column } from 'typeorm';

// TODO
@InputType()
export class CreateCompanyInput {
  @Field(() => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @Field(() => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  person_name: string;

  @Field(() => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  language: string;

  @Field(() => String, { nullable: true })
  @Column()
  @IsOptional()
  @IsString()
  uid: string;

  @Field(() => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  //@IsAddress() // TODO define
  domicile_address: string;

  @Field(() => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  //@IsAddress() // TODO define
  correspondence_address: string;

  @Field(() => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String)
  @Column()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => Boolean)
  @Column()
  @IsBoolean()
  branch_structure: boolean;
}
