import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@ObjectType()
@Entity({ name: 'employee' })
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

  @Column()
  @Field(() => String, { description: 'Gender' })
  @IsString()
  gender: string;

  @Field(() => Company, { description: 'Company' })
  @JoinColumn()
  @OneToOne(() => Company)
  company: Company;
}
