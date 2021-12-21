import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePersonInput } from '../../../person/dto/create-person.input';
import { Bank } from '../../../bank/entities/bank.entity';
import { Dossier } from '../../../dossier/entity/dossier.entity';
import PrivateFile from '../../../file/entities/private_file.entity';
import { CreateDossierInput } from '../../../dossier/dto/input/create-dossier.input';
import { CreateBankInput } from '../../../bank/dto/input/create-bank.input';

@InputType()
export class CreateOfferInput extends PartialType(CreatePersonInput) {
  @Field(() => CreateDossierInput, { description: 'Dossier of Offer' })
  dossier: Dossier;

  @Field(() => CreateBankInput, { description: 'Bank making the offer' })
  bank: Bank;

  // @Field(() => PrivateFile, {
  //   description: 'The Offer as a PDF',
  //   nullable: true,
  // })
  // pdf: PrivateFile;
}
