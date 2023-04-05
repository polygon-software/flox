import { Field, InputType } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

import MessageInput from './message.input';

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
