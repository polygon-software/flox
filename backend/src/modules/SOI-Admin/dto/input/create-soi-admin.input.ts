import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePersonInput } from '../../../person/dto/create-person.input';

@InputType()
/**
 * Input for the creation of an SOI Admin
 */
export class CreateSoiAdminInput extends PartialType(CreatePersonInput) {}
