import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsArray, IsEmail, IsInt, IsString, IsUUID } from 'class-validator';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  AfterInsert,
  AfterLoad,
  AfterUpdate,
} from 'typeorm';
import { ROLE } from '../../../ENUM/ENUM';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Project } from '../../project/entities/project.entity';

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

  @Field(() => String, { description: 'Username' })
  @Index({ unique: true })
  @Column({ nullable: true })
  @IsString()
  username: string;

  @Field(() => String, { description: 'E-mail' })
  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Column('integer')
  @IsInt()
  ADID: number;

  @Field(() => [Project], {
    description: 'Projects that the user has access to',
  })
  @OneToMany(() => Project, (project) => project.user, {
    cascade: true,
    nullable: true,
  })
  projects: Project[];

  @Field(() => [String], { description: 'Devices that the user has access to' })
  @Column('simple-array', { nullable: true })
  @IsArray()
  devices: string[];

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks() {
    if (!this.projects) {
      this.projects = [];
    }
    if (!this.devices) {
      this.devices = [];
    }
  }
}
