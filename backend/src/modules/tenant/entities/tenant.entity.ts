import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';
import { FLOOR } from '../../../ENUM/enum';
import Address from '../../address/entities/address.entity';

/**
 * Tenant entity
 */
@Entity()
@ObjectType()
export default class Tenant extends BaseEntity {
  @Field(() => String, { description: "Tenant's first name", nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Field(() => String, { description: "Tenant's last name", nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Field(() => Address, { description: "Tenant's address", nullable: true })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, nullable: true })
  @IsObject()
  @IsOptional()
  address: Address;

  @Field(() => String, { description: "Tenant's phone number", nullable: true })
  @Column({ nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @Field(() => String, {
    description: "Client's e-mail address",
    nullable: true,
  })
  @Column({ nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @Field(() => FLOOR, {
    description: "Floor type of tenant's apartment",
    nullable: true,
  })
  @Column({ type: 'enum', enum: FLOOR, nullable: true })
  @IsEnum(FLOOR)
  @IsOptional()
  floorType: FLOOR;

  @Field(() => Number, {
    description: "Floor number of tenant's apartment",
    nullable: true,
  })
  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  floorNumber: number;

  /**
   * Ensures that the combination of floor and floor number is valid.
   */
  @BeforeInsert()
  @BeforeUpdate()
  checkFloor(): void {
    if (this.floorType === FLOOR.GROUND_FLOOR && this.floorNumber) {
      throw new Error(`Floor number must be null for floor ${this.floorType}`);
    }
    // when floorNumber === 0 it also evaluates to true when asked !this.floorNumber, therefore we need to check for !== 0
    if (
      (this.floorType === FLOOR.UPPER_FLOOR ||
        this.floorType === FLOOR.BASEMENT) &&
      !this.floorNumber &&
      this.floorNumber !== 0
    ) {
      throw new Error(`Floor number must be set for ${this.floorType}`);
    }
  }
}
