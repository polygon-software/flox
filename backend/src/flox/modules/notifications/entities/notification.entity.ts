import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import User from '../../auth/entities/user.entity';
import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';

import Message from './message.entity';

@Entity()
@ObjectType()
export default class Notification extends BaseEntity {
  @Field(() => User, {
    description: 'Recipient of the notification',
  })
  @ManyToOne(() => User)
  @JoinColumn()
  recipient: User;

  @Field(() => Boolean, {
    description: 'Whether the recipient has seen the notification',
  })
  @Column('boolean', { default: false })
  read = false;

  @Field(() => [Message], {
    description: 'Messages in different languages related to this notification',
  })
  @OneToMany(() => Message, (message) => message.notification, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  messages: Message[];
}
