import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import { User } from '../../../user/entities/user.entity';
import { Announcement } from '../../../announcement/entities/announcement.entity';

@InputType()
export class CreateNotificationInput {
  @Field(() => String, { description: 'Title' })
  @IsString()
  title: string;

  @Field(() => Date, { description: 'Date of receiving' })
  @IsDate()
  received: Date;

  @Field(() => String, { description: 'Content' })
  @IsString()
  content: string;

  @Field(() => Boolean, { description: 'Read status' })
  @IsBoolean()
  isRead: boolean;

  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Announcement, { nullable: true })
  announcement: Announcement;
}
