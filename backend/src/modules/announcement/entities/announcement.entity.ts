import { ObjectType, InputType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsDate, IsString } from 'class-validator';
import { ROLE } from '../../../ENUM/ENUM';
import { Notification } from '../../notification/entities/notification.entity';

@ObjectType()
@Entity({ name: 'announcement' })
@InputType('announcement')
/**
 * An application User
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

  @Field(() => ROLE, { description: 'User role to receive notification' })
  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.NONE,
  })
  @IsString()
  userRole: ROLE;

  @Field(() => [Notification], {
    description: 'Notifications generated',
    nullable: true,
  })
  @OneToMany(() => Notification, (notification) => notification.announcement, {
    cascade: true,
  })
  notifications: Notification[];
}
