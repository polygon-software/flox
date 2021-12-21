import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePersonInput } from '../../../person/dto/create-person.input';
import { IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class CreateSoiEmployeeInput extends PartialType(CreatePersonInput) {
  @Field(() => String, { description: 'Phone Number' })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String, { description: 'Gender' })
  @IsString()
  gender: string;
}
