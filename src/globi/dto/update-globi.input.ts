import { CreateGlobiInput } from './create-globi.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGlobiInput extends PartialType(CreateGlobiInput) {
  @Field(() => Int)
  id: number;
}
