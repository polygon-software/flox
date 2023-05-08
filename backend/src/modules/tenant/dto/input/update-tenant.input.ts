import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

import CreateTenantInput from './create-tenant.input';

@InputType()
export default class UpdateTenantInput extends PartialType(CreateTenantInput) {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
