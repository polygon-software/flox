import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { ROLE } from '../../../../ENUM/ENUM';

@InputType()
export class CreateAnnouncementInput {
  @Field(() => String, { description: 'Title' })
  @IsString()
  title: string;

  @Field(() => String, { description: 'Content' })
  @IsString()
  content: string;

  @Field(() => ROLE, { description: 'User role to receive notification' })
  @IsString()
  userRole: ROLE;
}
