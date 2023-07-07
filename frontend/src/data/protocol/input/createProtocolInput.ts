import { IsDate, IsOptional, IsString } from 'class-validator';

/**
 * A class representing an input object for creating a protocol data object
 */
export default class CreateProtocolInput {
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  articleNumber?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  amount?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  discount?: string;

  @IsString()
  @IsOptional()
  sum?: string;
}
