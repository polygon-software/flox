import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMinSize,
  IsArray,
  IsLocale,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

@InputType()
class MessageInput {
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

@InputType()
export default class NotifyInput {
  @Field(() => [MessageInput], {
    description: 'Messages in different languages',
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  messages: MessageInput[];
}
