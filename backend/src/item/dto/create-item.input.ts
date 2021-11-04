import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Name' })
  @IsString()
  name: string;

  @Field(() => ID, { description: 'User UUID', nullable: true })
  @IsUUID()
  userUUID: string;
}
