import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsString } from 'class-validator';

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
}
