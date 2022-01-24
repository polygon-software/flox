import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateAnnouncementInput {
  @Field(() => ID, { description: 'UUID' })
  @IsUUID()
  uuid: string;

  @Field(() => String, { description: 'Title' })
  @IsString()
  title: string;

  @Field(() => String, { description: 'Content' })
  @IsString()
  content: string;

  @Field(() => Date, { description: 'Date of announcement', nullable: true })
  @IsDate()
  date: Date;

  @Field(() => Boolean, { description: 'Is the announcement scheduled?' })
  @IsBoolean()
  scheduled: boolean;
}
