import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsDate, IsString } from 'class-validator';
import { ROLE } from '../../../../ENUM/ENUM';

@InputType()
export class CreateAnnouncementInput {
  @Field(() => String, { description: 'Title' })
  @IsString()
  title: string;

  @Field(() => String, { description: 'Content' })
  @IsString()
  content: string;

  @Field(() => [ROLE], { description: 'User roles to receive notification' })
  @IsArray()
  userRoles: ROLE[];

  @Field(() => Date, { description: 'Date of announcement', nullable: true })
  @IsDate()
  date: Date;

  @Field(() => Boolean, { description: 'Is the announcement scheduled?' })
  @IsBoolean()
  scheduled: boolean;
}
