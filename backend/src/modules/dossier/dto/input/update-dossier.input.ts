import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateDossierInput } from './create-dossier.input';
import { Address } from '../../../address/entities/address.entity';
import { UpdateAddressInput } from '../../../address/dto/input/update-address.input';

@InputType()
export class UpdateDossierInput extends PartialType(CreateDossierInput) {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => UpdateAddressInput)
  @IsNotEmpty()
  address: Address;
}
