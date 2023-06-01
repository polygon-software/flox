import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

import CreateImageFileInput from './create-image-file.input';

@InputType()
export default class UpdateImageFileInput extends PartialType(
  CreateImageFileInput,
) {
  @Field(() => ID, { description: 'ImageFile UUID', nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
