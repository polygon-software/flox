import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreatePersonInput {
  @Field(() => String, { description: 'First Name' })
  @IsString()
  first_name: string;

  @Field(() => String, { description: 'Last Name' })
  @IsUUID()
  last_name: string;
}
