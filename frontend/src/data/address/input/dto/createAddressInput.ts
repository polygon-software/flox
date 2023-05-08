import { IsInt, IsOptional, IsString } from 'class-validator';

/**
 * A class representing an input object for creating an address data object
 */
export default class CreateAddressInput {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsInt()
  @IsOptional()
  zipCode?: number;

  @IsString()
  @IsOptional()
  additionalAddress?: string;
}
