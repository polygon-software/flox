import { Field, ObjectType } from '@nestjs/graphql';
import {
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
  Entity,
  Column,
} from 'typeorm';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';
import User from '../../auth/entities/user.entity';

import UserGroup from './user-group.entity';

@ObjectType()
@Entity()
export default class AccessControlledEntity extends BaseEntity {
  @Field(() => Boolean, {
    description: 'Marks this object as publicly readable',
  })
  @Column('boolean', { default: false })
  public publicReadAccess = false;

  @Field(() => Boolean, {
    description: 'Marks this object as readable for all logged in users',
  })
  @Column('boolean', { default: false })
  public loggedInReadAccess = false;

  @Field(() => User, {
    description: 'Owner of this object, has full control over it',
  })
  @ManyToOne(() => User)
  @JoinColumn()
  public owner: User;

  @Field(() => [User], {
    description: 'People with read access to this resource',
  })
  @ManyToMany(() => UserGroup, (userGroup) => userGroup.readAccess)
  @JoinTable()
  public readAccess: UserGroup[];

  @Field(() => [User], {
    description: 'People with write access to this resource',
  })
  @ManyToMany(() => UserGroup, (userGroup) => userGroup.writeAccess)
  @JoinTable()
  public writeAccess: UserGroup[];
}
