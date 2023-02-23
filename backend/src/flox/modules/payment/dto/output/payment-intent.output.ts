import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import {
  IsCurrency,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';
import { Stripe } from 'stripe';

@ObjectType()
export default class PaymentIntentOutput {
  @Field(() => ID, { description: 'UUID' })
  @IsUUID()
  uuid: string;

  @Field(() => String, {
    description: 'Description of purchase',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  description: string;

  @Field(() => String, {
    description: 'Stripe payment intent client secret',
  })
  @IsString()
  secret: string;

  @Field(() => String, {
    description: 'Payment status',
  })
  @Column()
  @IsString()
  status: Stripe.PaymentIntent.Status;

  @Field(() => Float, {
    description: 'Amount paid in this transaction',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @Field(() => String, {
    description: 'transaction currency',
  })
  @IsString()
  @IsCurrency()
  @IsNotEmpty()
  currency: string;
}
