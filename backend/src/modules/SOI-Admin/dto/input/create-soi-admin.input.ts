import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePersonInput } from '../../../person/dto/create-person.input';

@InputType()
export class CreateSoiAdminInput extends PartialType(CreatePersonInput) {}
