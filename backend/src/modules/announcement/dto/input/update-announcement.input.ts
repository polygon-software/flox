import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsDate, IsString, IsUUID } from 'class-validator';
import { ROLE } from '../../../../ENUM/ENUM';

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
