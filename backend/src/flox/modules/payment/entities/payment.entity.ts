import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsCurrency,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import User from '../../auth/entities/user.entity';
import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';

@Entity()
@ObjectType()
export default class Payment extends BaseEntity {
  @Field(() => Boolean, {
    description: 'Whether the payment is completed',
  })
  @Column()
  @IsBoolean()
  @IsNotEmpty()
  paid: boolean;

  @Field(() => String, {
    description: 'Description of purchase',
  })
  @Column()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  description: string;

  @Field(() => Float, {
    description: 'Amount payed in this transaction',
  })
  @Column()
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @Field(() => String, {
    description: 'transaction currency',
  })
  @Column()
  @IsString()
  @IsCurrency()
  @IsNotEmpty()
  currency: string;

  @Field(() => User, {
    description: 'Author of this article',
  })
  @ManyToOne(() => User)
  @JoinColumn()
  buyer: User;
}
