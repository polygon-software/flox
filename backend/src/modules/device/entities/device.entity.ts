import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';
import { DEVICE_TYPE } from '../../../ENUM/enum';
import Form from '../../form/entities/form.entity';

/**
 * Device entity
 */
@Entity()
@ObjectType()
export default class Device extends BaseEntity {
  @Field(() => DEVICE_TYPE, { description: 'Device to repair', nullable: true })
  @Column({ type: 'enum', enum: DEVICE_TYPE, nullable: true })
  @IsEnum(DEVICE_TYPE)
  @IsOptional()
  deviceType: DEVICE_TYPE;

  @Field(() => String, {
    description: 'Manufacturer that made the device',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  deviceManufacturer: string;

  @Field(() => String, { description: "Device's model", nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  deviceModel: string;

  @Field(() => String, {
    description: "Device's production number",
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  deviceProductionNumber: string;

  @Field(() => Number, {
    description: 'Year the device was manufactured',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  deviceProductionYear: number;

  @Field(() => String, {
    description: 'Additional information about the device',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  deviceInformation: string;

  @Field(() => Form, {
    description: 'Form the device belongs to',
  })
  @IsObject()
  @ManyToOne(() => Form, (form) => form.devices, { onDelete: 'CASCADE' })
  form: Form;
}
