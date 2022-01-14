import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ROLE, USER_STATUS } from '../../../ENUM/ENUM';
import Address from '../../address/entities/address.entity';
import PrivateFile from '../../file/entities/private_file.entity';
import Comment from '../../comment/entities/comment.entity';

@ObjectType()
@Entity()
/**
 * An application User
 */
export class User {
  @Field(() => ROLE, { description: 'Role of the User' })
  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.NONE,
  })
  @IsString()
  role: ROLE;

  @Field(() => USER_STATUS, { description: 'Status of the user account' })
  @Column({
    type: 'enum',
    enum: USER_STATUS,
    default: USER_STATUS.NONE,
  })
  @IsString()
  status: USER_STATUS;

  @Field(() => ID, { description: 'Cognito ID' })
  @PrimaryColumn()
  @IsUUID()
  uuid: string;

  @Field(() => Address, { description: 'Domicile address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true })
  address: Address;

  @Field(() => Date, { description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String, { description: 'Username' })
  @Column()
  @IsString()
  username: string;

  @Field(() => String, { description: 'Full name' })
  @Column()
  @IsString()
  fullName: string;

  @Field(() => String, { description: 'E-mail' })
  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Phone number' })
  @Column()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => Date, { description: 'Date of birth' })
  @Column()
  @IsString()
  @IsDate()
  birthdate: Date;

  @Field(() => [String], { description: 'User interest categories' })
  @Column('text', { array: true })
  @IsArray()
  interests: string[];

  @Field(() => Date, { description: 'Last modification date' })
  @UpdateDateColumn()
  lastModifiedAt: Date;

  @Field(() => Date, { description: 'Date of deletion', nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @Field(() => Date, {
    description: 'Date until which the users account is disabled (if any)',
    nullable: true,
  })
  @Column({ nullable: true })
  disabledUntil: Date;

  @Field(() => [PrivateFile], {
    nullable: true,
    description: 'Documents of the user (e.g. ID copy)',
  })
  @OneToMany(() => PrivateFile, (file) => file.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  documents: PrivateFile[];

  @Field(() => [Comment], {
    nullable: true,
    description: 'Comments written by the user',
  })
  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
    eager: true,
  })
  comments: Comment[];
}
