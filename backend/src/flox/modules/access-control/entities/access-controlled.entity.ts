import { Field, ObjectType } from '@nestjs/graphql';

import { Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { User } from '../../auth/entities/user.entity';

import { UserGroup } from './user-group.entity';

@Entity()
@ObjectType()
export class AccessControlledEntity extends BaseEntity {
  @Field(() => Boolean, {
    description: 'Marks this object as publicly readable',
  })
  public publicReadAccess = false;

  @Field(() => Boolean, {
    description: 'Marks this object as readable for all logged in users',
  })
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
  public readAccess: UserGroup[] = [];

  @Field(() => [User], {
    description: 'People with write access to this resource',
  })
  @ManyToMany(() => UserGroup, (userGroup) => userGroup.writeAccess)
  public writeAccess: UserGroup[] = [];
}
