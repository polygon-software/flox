import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

import CreateProtocolInput from './create-protocol.input';

@InputType()
export default class UpdateProtocolInput extends PartialType(
  CreateProtocolInput,
) {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
