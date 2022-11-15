import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsLocale,
  IsLowercase,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';

import Notification from './notification.entity';

@Entity()
@ObjectType()
export default class Message extends BaseEntity {
  @Field(() => String, { description: 'Language of message' })
  @Column({ type: 'text' })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  lang: string;

  @Field(() => String, {
    description: 'Title of message',
  })
  @Column()
  title: string;

  @Field(() => String, {
    description: 'Content of message',
  })
  @Column()
  content: string;

  @Field(() => String, {
    description: 'Link to which the user is lead on click of the notification',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsOptional()
  link?: string;

  @Field(() => Notification, {
    description: 'Notification on which this message appears',
  })
  @ManyToOne(() => Notification)
  notification: Notification;
}
