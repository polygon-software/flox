import { ObjectType, InputType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsBoolean, IsDate, IsString } from 'class-validator';

@ObjectType()
@Entity({ name: 'notification' })
@InputType('notification')
/**
 * An application User
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
}
