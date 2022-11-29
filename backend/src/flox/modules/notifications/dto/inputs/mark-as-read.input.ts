import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export default class MarkAsReadInput {
  @Field(() => ID, {
    description: 'Uuid of notification',
  })
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}
