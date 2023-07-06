import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';
import Device from '../../device/entities/device.entity';
import ImageFile from '../../image-file/entities/image-file.entity';
import Job from '../../job/entities/job.entity';
import Client from '../../client/entities/client.entity';
import Article from '../../article/entities/article.entity';
import Expense from '../../expense/entities/expense.entity';
import Tenant from '../../tenant/entities/tenant.entity';
import Billing from '../../billing/entities/billing.entity';

/**
 * Form entity
 */
@Entity()
@ObjectType()
export default class Form extends BaseEntity {
  @Field(() => Job, { description: 'Job details', nullable: true })
  @JoinColumn()
  @OneToOne(() => Job, { cascade: true, nullable: true })
  @IsObject()
  @IsOptional()
  job: Job;

  @Field(() => Date, {
    description: 'Date the form is created',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  startDate: Date;

  @Field(() => Date, {
    description: 'Date the form is resolved',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  endDate: Date;

  @Field(() => String, { description: 'Internal order number', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  internalOrderNumber: string;

  @Field(() => String, { description: 'External order number', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  externalOrderNumber: string;

  @Field(() => Client, { description: 'Job client', nullable: true })
  @JoinColumn()
  @OneToOne(() => Client, {
    cascade: true,
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  client: Client;

  @Field(() => String, { description: 'Owner', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  owner: string;

  @Field(() => String, { description: 'Object number', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  objectNumber: string;

  @Field(() => Tenant, { description: 'Tenant', nullable: true })
  @JoinColumn()
  @OneToOne(() => Tenant, {
    cascade: true,
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  tenant: Tenant;

  @Field(() => Boolean, {
    description: 'Whether the measured voltage and power (NIV) is correct',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsBoolean()
  @IsOptional()
  measurePower: boolean;

  @Field(() => Billing, { description: 'Billing information', nullable: true })
  @JoinColumn()
  @OneToOne(() => Billing, {
    cascade: true,
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  billing: Billing;

  @Field(() => String, { description: 'Problem description', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => [Device], {
    description: 'Devices to repair',
    nullable: true,
  })
  @OneToMany(() => Device, (device) => device.form, {
    cascade: true,
  })
  @IsArray()
  @IsOptional()
  devices: Device[];

  @Field(() => Date, {
    description: 'Protocol date',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  protocolDate: Date;

  @Field(() => String, { description: 'Protocol text', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  protocolText: string;

  @Field(() => [Article], { description: 'Articles', nullable: true })
  @OneToMany(() => Article, (article) => article.form, {
    cascade: true,
  })
  @IsArray()
  @IsOptional()
  articles: Article[];

  @Field(() => [Expense], { description: 'Expenses', nullable: true })
  @OneToMany(() => Expense, (expense) => expense.form, {
    cascade: true,
  })
  @IsArray()
  @IsOptional()
  expenses: Expense[];

  @Field(() => Number, {
    description: 'Total cost of the job',
    nullable: true,
  })
  @Column({ type: 'float8', nullable: true })
  @IsNumber()
  @IsOptional()
  totalAmount: number;

  @Field(() => String, { description: "Employee's ID", nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  employeeId: string;

  @Field(() => String, { description: 'Additonal text', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  freeText: string;

  @Field(() => [ImageFile], { description: 'Additonal images', nullable: true })
  @OneToMany(() => ImageFile, (file) => file.form, {
    cascade: true,
  })
  @IsArray()
  @IsOptional()
  images: ImageFile[];

  @Field(() => [String], {
    description: 'ImageFiles as base64',
    nullable: true,
  })
  @IsArray()
  @IsOptional()
  imageStrings: string[];

  @Field(() => Boolean, {
    description: 'Whether the form can be pulled by ERP',
  })
  @Column({ default: false })
  @IsBoolean()
  isPullable: boolean;

  @Field(() => Date, {
    description: 'Last time the form was pulled by ERP',
    nullable: true,
  })
  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  pulledAt: Date;

  @Field(() => Boolean, {
    description: 'Whether the job is an emergency',
  })
  @Column({ default: false })
  @IsBoolean()
  isEmergency: boolean;

  @Field(() => Boolean, {
    description: 'Whether the job is finished',
  })
  @Column({ default: false })
  @IsBoolean()
  isFinished: boolean;
}
