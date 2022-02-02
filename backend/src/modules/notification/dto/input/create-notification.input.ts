import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsString } from 'class-validator';
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

  @Field(() => ID, { nullable: true })
  userUuid: string;

  @Field(() => ID, { nullable: true })
  announcementUuid: string;
}
