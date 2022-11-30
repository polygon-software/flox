import {
  IsCurrency,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';

import type { PaymentIntent } from '@stripe/stripe-js/types/api/payment-intents';

export default class PaymentEntity extends BaseEntity {
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: PaymentIntent.Status;

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

  @IsOptional()
  @IsObject()
  buyer?: UserEntity;
}
