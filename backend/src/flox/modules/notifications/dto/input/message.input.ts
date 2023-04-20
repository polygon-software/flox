import { Field, InputType } from '@nestjs/graphql';
import {
  IsLocale,
  IsLowercase,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export default class MessageInput {
  @Field(() => String, { description: 'Language of message' })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  lang: string;

  @Field(() => String, {
    description: 'Title of message',
  })
  title: string;

  @Field(() => String, {
    description: 'Content of message',
  })
  content: string;

  @Field(() => String, {
    description: 'Link to which the user is lead on click of the notification',
    nullable: true,
  })
  @IsOptional()
  link?: string;
}
