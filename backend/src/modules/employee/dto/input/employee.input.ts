import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { Company } from '../../../company/entities/company.entity';
import { Dossier } from '../../../dossier/entity/dossier.entity';
import { Person } from '../../../person/entities/person.entity';

@InputType('EmployeeInput')
export class EmployeeInput extends Person {
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

  @Field(() => Company, { description: 'Company' })
  company: Company;

  @Field(() => [Dossier], { description: 'Dossiers of employee' })
  dossiers: Dossier[];
}
