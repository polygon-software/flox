import {
  IsCurrency,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

export default class PaymentEntity extends BaseEntity {
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  secret?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount?: number;

  @IsOptional()
  @IsString()
  @IsCurrency()
  @IsNotEmpty()
  currency?: string;
}
