import { InputType, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export default class CreateAddressInput {
  @Field(() => String)
  @IsString()
  street: string;

  @Field(() => String)
  @IsString()
  number: string;

  @Field(() => String)
  @IsString()
  city: string;

  @Field(() => Number)
  @IsInt()
  zipCode: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  additionalAddress: string;
}
