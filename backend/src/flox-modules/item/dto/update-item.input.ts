import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID, { description: 'Item UUID' })
  @IsUUID()
  uuid: string;

  @Field(() => ID, { description: 'User UUID', nullable: true })
  @IsUUID()
  userUUID: string;

  @Field(() => String, { description: 'Name', nullable: true })
  @IsString()
  name: string;
}
