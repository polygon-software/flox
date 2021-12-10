import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateAddressInput {
  @Field(() => String)
  @IsString()
  street: string;

  @Field(() => String)
  @IsString()
  number: string;

  @Field(() => String)
  @IsString()
  city: string;

  @Field(() => String)
  @IsString()
  zip_code: string;
}
