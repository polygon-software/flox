import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import User from '../../auth/entities/user.entity';
import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';

@Entity()
@ObjectType()
export default class Notification extends BaseEntity {
  @Field(() => User, {
    description: 'Receiver of the notification',
  })
  @ManyToOne(() => User)
  @JoinColumn()
  public receiver: User;

  @Field(() => Boolean, {
    description: 'Whether the receiver has seen the notification',
  })
  @Column('boolean', { default: false })
  public read = false;

  @Field(() => String, {
    description: 'Link to which the user is lead on click of the notification',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsOptional()
  public link?: string;

  @Field(() => String, {
    description: 'Title of notification in german',
  })
  @Column()
  public deTitle: string;

  @Field(() => String, {
    description: 'Content of notification in german',
  })
  @Column()
  public deContent: string;

  @Field(() => String, {
    description: 'Title of notification in english',
  })
  @Column()
  public enTitle: string;

  @Field(() => String, {
    description: 'Content of notification in english',
  })
  @Column()
  public enContent: string;
}
