import { IsOptional, IsString } from 'class-validator';

import CreateTenantInput from 'src/data/tenant/dto/input/createTenantInput';

/**
 * A class representing an input object for updating a tenant data object
 */
export default class UpdateTenantInput extends CreateTenantInput {
  @IsString()
  @IsOptional()
  uuid?: string;
}
