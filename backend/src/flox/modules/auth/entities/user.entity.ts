import { Field, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { IsEmail, IsString } from 'class-validator';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';
import { isModuleActive } from '../../../core/flox-helpers';
import { MODULES } from '../../../MODULES';
import UserGroup from '../../access-control/entities/user-group.entity';
import { moduleConfig } from '../../roles/config';

/**
 * A user registered within cognito, having a role and contact information
 */
@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => String, { description: 'Username' })
  @Column()
  @IsString()
  username: string;

  @Field(() => String, { description: 'E-mail address' })
  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Cognito UUID' })
  @Column()
  @IsString()
  cognitoUuid: string;

  @Field(() => String, { description: 'User role', nullable: true })
  @Column({ nullable: true })
  @IsString()
  role: string;

  @Field(() => [UserGroup], {
    description: 'User groups this user belongs to',
  })
  @ManyToMany(() => UserGroup, (userGroup) => userGroup.users)
  @JoinTable()
  public groups: UserGroup[];

  /**
   * Before inserting or updating data, ensures the role matches one given in config
   */
  @BeforeInsert()
  @BeforeUpdate()
  validateRole(): void {
    if (isModuleActive(MODULES.ROLES)) {
      // Determine roles from config
      const allowedRoles = moduleConfig().roles;
      if (this.role && !allowedRoles.includes(this.role)) {
        throw new Error(`Invalid role '${this.role}'`);
      }
    }
  }
}
