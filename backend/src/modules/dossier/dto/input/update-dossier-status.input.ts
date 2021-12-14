import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import {STATUS} from "../../../../ENUM/ENUMS";

@InputType()
export class UpdateDossierStatusInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  status: STATUS;
}
