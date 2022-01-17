import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

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
}
