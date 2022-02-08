import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Announcement } from '../../announcement/entities/announcement.entity';

@ObjectType()
@Entity({ name: 'notification' })
/**
 * A notification for a specific user. Can also belong to an announcement that triggered its creation.
 */
export class Notification extends BaseEntity {
  @Field(() => String, { description: 'Title' })
  @Column()
  @IsString()
  title: string;

  @Field(() => Date, { description: 'Date of receiving' })
  @Column()
  @IsDate()
  received: Date;

  @Field(() => String, { description: 'Content' })
  @Column()
  @IsString()
  content: string;

  @Field(() => Boolean, { description: 'Read status' })
  @Column()
  @IsBoolean()
  isRead: boolean;

  @Field(() => User, { description: 'The user this notification is for' })
  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  user: User;

  @Field(() => Announcement, {
    description: 'The announcement this notification is from',
    nullable: true,
  })
  @ManyToOne(() => Announcement, (announcement) => announcement.messages)
  announcement: Announcement;
}
