import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class IsDossierCompleteInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;
}
