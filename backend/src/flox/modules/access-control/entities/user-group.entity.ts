import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeRemove, Column, Entity, ManyToMany } from 'typeorm';
import { IsString } from 'class-validator';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';
import User from '../../auth/entities/user.entity';

import AccessControlledEntity from './access-controlled.entity';

@ObjectType()
@Entity()
export default class UserGroup extends BaseEntity {
  @Field(() => String, { description: 'Username' })
  @Column()
  @IsString()
  name: string;

  @Field(() => [User], {
    description: 'Users belonging to this user group',
  })
  @ManyToMany(() => User, (user) => user.groups)
  public users: User[];

  @Field(() => AccessControlledEntity, {
    description: 'Resources this user group has read access to',
  })
  @ManyToMany(
    () => AccessControlledEntity,
    (accessControl) => accessControl.readAccess,
  )
  public readAccess: AccessControlledEntity[];

  @Field(() => AccessControlledEntity, {
    description: 'Resources this user group has write access to',
  })
  @ManyToMany(
    () => AccessControlledEntity,
    (accessControl) => accessControl.writeAccess,
  )
  public writeAccess: AccessControlledEntity[];
}
