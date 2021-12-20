import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { STATUS } from '../../../../ENUM/ENUMS';
import { CreatePersonInput } from '../../../person/dto/create-person.input';

@InputType()
export class UpdateDossierInput extends PartialType(CreatePersonInput) {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => Date, { nullable: true })
  @IsDate()
  born: Date;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  loan_sum: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  non_arrangeable: boolean;

  @Field(() => STATUS, { nullable: true })
  @IsNotEmpty()
  status: STATUS;
}
