import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsArray, IsBoolean, IsDate, IsString } from 'class-validator';
import { ROLE } from '../../../ENUM/ENUM';
import { Notification } from '../../notification/entities/notification.entity';

@ObjectType()
@Entity({ name: 'announcement' })
/**
 * An announcement that is sent to one or more user roles in the form of a notification
 */
export class Announcement extends BaseEntity {
  @Field(() => String, { description: 'Title' })
  @Column()
  @IsString()
  title: string;

  @Field(() => String, { description: 'Content' })
  @Column()
  @IsString()
  content: string;

  @Field(() => Date, { description: 'Date of announcement' })
  @Column()
  @IsDate()
  date: Date;

  @Field(() => Boolean, { description: 'Is the announcement scheduled?' })
  @Column()
  @IsBoolean()
  scheduled: boolean;

  @Field(() => [ROLE], { description: 'User roles to receive notification' })
  @Column('text', { array: true })
  @IsArray()
  userRoles: ROLE[];

  @Field(() => [Notification], {
    description: 'Notifications generated',
    nullable: true,
  })
  @OneToMany(() => Notification, (notification) => notification.announcement, {
    cascade: true,
    eager: true,
  })
  notifications: Notification[];
}
