import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateNotificationInput {
  @Field(() => ID, { description: 'UUID' })
  @IsUUID()
  uuid: string;

  @Field(() => String, { description: 'Title', nullable: true })
  @IsString()
  title: string;

  @Field(() => Date, { description: 'Date of receiving', nullable: true })
  @IsDate()
  received: Date;

  @Field(() => String, { description: 'Content', nullable: true })
  @IsString()
  content: string;

  @Field(() => Boolean, { description: 'Read status', nullable: true })
  @IsBoolean()
  isRead: boolean;
}
