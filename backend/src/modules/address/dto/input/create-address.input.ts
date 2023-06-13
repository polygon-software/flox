import { InputType, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export default class CreateAddressInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  street: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  number: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  city: string;

  @Field(() => Number, { nullable: true })
  @IsInt()
  @IsOptional()
  zipCode: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  additionalAddress: string;
}
