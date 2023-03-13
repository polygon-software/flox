import { Field, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsLocale,
  IsLowercase,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import flox from '../../../../../flox.config.json';
import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';
import { isModuleActive } from '../../../core/flox-helpers';
import { MODULES } from '../../../MODULES';
import UserGroup from '../../access-control/entities/user-group.entity';
import { moduleConfig } from '../../roles/config';

/**
 * A user registered within Cognito, having a role and contact information
 */
@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => String, { description: 'Username' })
  @Column()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  username: string;

  @Field(() => String, { description: 'Preferred language of user' })
  @Column({ type: 'text', default: 'en' })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  lang = 'en';

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

  @Field(() => Boolean, { description: 'User enabled or not', nullable: true })
  @IsBoolean()
  enabled?: boolean;

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

  /**
   * Before inserting or updating data, ensures the language is available
   */
  @BeforeInsert()
  @BeforeUpdate()
  validateLang(): void {
    if (!flox.i18n.availableLocales.includes(this.lang)) {
      throw new Error(`Invalid language '${this.lang}'`);
    }
  }
}
