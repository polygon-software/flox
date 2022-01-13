import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateNotificationInput {
  @Field(() => ID, { description: 'UUID' })
  @IsUUID()
  uuid: string;

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
