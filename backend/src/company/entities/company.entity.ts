import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { Address } from '../../address/entities/address.entity';
import { Person } from '../../person/entities/person.entity';
import { Employee } from '../../employee/entities/employee.entity';

/**
 * An entity representing a company account
 * Initial status: 'document_upload_enabled' is set to 'false', and enabled once approved by SOI admin
 */

@ObjectType()
@InputType('company')
@Entity({ name: 'company' })
export class Company extends Person {
  @Field(() => String, { description: 'Company Name' })
  @Column()
  @IsString()
  company_name: string;

  @Field(() => String, { description: 'Language' })
  @Column()
  @IsString()
  language: string;

  @Field(() => String, { description: 'Company UID' })
  @Column()
  @IsString()
  @IsOptional()
  uid: string;

  @Field(() => Address, { description: 'Domicile address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true })
  domicile_address: Address;

  @Field(() => Address, { description: 'Correspondence address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true })
  correspondence_address: Address;

  @Field(() => String, { description: 'Phone Number' })
  @Column()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String, { description: 'E-Mail address' })
  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => Boolean, { description: 'Branch structure' })
  @Column()
  @IsBoolean()
  branch_structure: boolean;

  @Field(() => Boolean, {
    description:
      'Whether document upload is enabled (initial request granted by SOI)',
  })
  @Column()
  @IsBoolean()
  document_upload_enabled: boolean;

  // TODO documents

  // @JoinColumn() TODO re-add
  // @Field(() => [Employee], {
  //   description: 'Employees of the company',
  //   nullable: true,
  // })
  // @OneToMany(() => Employee, (employee) => employee.company, { cascade: true })
  // employees: Employee[];
}
