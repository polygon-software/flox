import { ObjectType, Field, InputType, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { Comment } from '../../comment/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ROLE } from '../../../ENUM/ENUM';

@ObjectType()
@Entity({ name: 'user' })
@InputType('user')
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

  @Field(() => ID, { description: 'Cognito ID' })
  @PrimaryColumn()
  @IsUUID()
  uuid: string;

  @Field(() => ID, { description: 'UUID of the specific entity' })
  @Column()
  @IsUUID()
  fk: string;

  @Field(() => Date, { description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [Comment], { description: 'Comments written by the user' })
  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
    eager: true,
  })
  comments: Comment[];

  @Field(() => [String], { description: 'User interest categories' })
  @Column()
  interests: string[];

  @Field(() => Date, { description: 'Last modification date' })
  @UpdateDateColumn()
  lastModifiedAt: Date;

  @Field(() => Date, { description: 'Date of deletion', nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;
}
