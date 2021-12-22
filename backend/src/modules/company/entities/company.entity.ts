import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Address } from '../../address/entities/address.entity';
import { Person } from '../../person/entities/person.entity';
import PrivateFile from '../../file/entities/private_file.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { CREATION_STATE } from '../../../ENUM/ENUMS';

/**
 * An entity representing a company account
 * Initial status: 'creation_state' is set to 'APPLIED', and set to AWAITING_DOCUMENTS once approved by SOI admin
 */

@Entity()
@ObjectType()
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
  @OneToOne(() => Address, { cascade: true, eager: true })
  domicile_address: Address;

  @Field(() => Address, { description: 'Correspondence address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true })
  correspondence_address: Address;

  @Field(() => String, { description: 'Phone Number' })
  @Column()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => Boolean, { description: 'Branch structure' })
  @Column()
  @IsBoolean()
  branch_structure: boolean;

  @Field(() => CREATION_STATE, {
    description: 'Stage of the creation process',
  })
  @Column({
    type: 'enum',
    enum: CREATION_STATE,
    default: CREATION_STATE.APPLIED,
  })
  creation_state: CREATION_STATE;

  // TODO ensure type to key
  @Field(() => [PrivateFile], {
    nullable: true,
    description: 'Documents of the company',
  })
  @OneToMany(() => PrivateFile, (file) => file.company, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  documents: PrivateFile[];

  @Field(() => [Employee], {
    description: 'Employees of the company',
    nullable: true,
  })
  @OneToMany(() => Employee, (employee) => employee.company, {
    cascade: true,
  })
  employees: Employee[];
}
