import { ObjectType, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ROLE } from '../../../ENUM/ENUM';
import { Address } from '../../address/entities/address.entity';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';

@ObjectType()
@Entity()
/**
 * An application User
 */
export class User extends BaseEntity {
  @Field(() => ROLE, { description: 'Role of the User' })
  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.USER,
  })
  @IsString()
  role: ROLE;

  @Field(() => ID, { description: 'Cognito user UUID' })
  @Column({ nullable: true })
  @IsUUID()
  cognitoUuid: string;

  @Field(() => Address, { description: 'Domicile address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true })
  address: Address;

  @Field(() => String, { description: 'Username' })
  @Column({ nullable: true })
  @IsString()
  username: string;

  @Field(() => String, { description: 'Full name' })
  @Column({ nullable: true })
  @IsString()
  fullName: string;

  @Field(() => String, { description: 'E-mail' })
  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Phone number' })
  @Column({ nullable: true })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => Date, { description: 'Date of birth' })
  @Column({ nullable: true })
  @IsString()
  @IsDate()
  birthdate: Date;

  @Field(() => [String], {
    description: 'Projects that the user has access to',
  })
  @Column('text', { array: true, nullable: true })
  @IsArray()
  projects: string[];

  @Field(() => [String], {
    description: 'MR2000 instances that the user has access to',
  })
  @Column('text', { array: true, nullable: true })
  @IsArray()
  mr2000instances: string[];

  @Field(() => [String], {
    description: 'MR3000 instances that the user has access to',
  })
  @Column('text', { array: true, nullable: true })
  @IsArray()
  mr3000instances: string[];
}
