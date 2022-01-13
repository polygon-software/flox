import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDate, IsString, IsUUID } from 'class-validator';
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

  @Field(() => Date, { description: 'Date of announcement' })
  @IsDate()
  date: Date;

  @Field(() => ROLE, { description: 'User role to receive notification' })
  @IsString()
  userRole: ROLE;
}
