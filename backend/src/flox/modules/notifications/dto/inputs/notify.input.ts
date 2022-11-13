import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export default class NotifyInput {
  @Field(() => String, {
    description: 'Link to which the user is lead on click of the notification',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  link?: string;

  @Field(() => String, {
    description: 'Title of notification in german',
  })
  @IsString()
  public deTitle: string;

  @Field(() => String, {
    description: 'Content of notification in german',
  })
  @IsString()
  public deContent: string;

  @Field(() => String, {
    description: 'Title of notification in english',
  })
  @IsString()
  public enTitle: string;

  @Field(() => String, {
    description: 'Content of notification in english',
  })
  @IsString()
  public enContent: string;
}
