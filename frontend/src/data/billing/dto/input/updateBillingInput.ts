import { IsOptional, IsString } from 'class-validator';

import CreateBillingInput from 'src/data/billing/dto/input/createBillingInput';

/**
 * A class representing an input object for updating a billing data object
 */
export default class UpdateBillingInput extends CreateBillingInput {
  @IsString()
  @IsOptional()
  uuid?: string;
}
