import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { CreatePersonInput } from 'src/modules/person/dto/create-person.input';

@InputType()
export class CreateEmployeeInput extends PartialType(CreatePersonInput) {
  @Field(() => String, { description: 'Language' })
  @IsString()
  language: string;

  @Field(() => String, { description: 'Function within the company' })
  @IsString()
  function: string;

  @Field(() => String, { description: 'Phone Number' })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String, { description: 'Gender' })
  @IsString()
  gender: string;

  @Field(() => String, { description: 'Company uuid' })
  @IsUUID()
  company_uuid: string;
}
