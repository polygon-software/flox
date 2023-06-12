import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import ArticleEntity from 'src/data/article/entities/articleEntity';
import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import ClientEntity from 'src/data/client/entities/clientEntity';
import DeviceEntity from 'src/data/device/entities/deviceEntity';
import ExpenseEntity from 'src/data/expense/entities/expenseEntity';
import ImageFileEntity from 'src/data/imageFile/entities/imageFileEntity';
import JobEntity from 'src/data/job/entities/jobEntity';
import TenantEntity from 'src/data/tenant/entities/tenantEntity';
import BillingEntity from 'src/data/billing/entities/billingEntity';

/**
 * A class representing a form data object
 */
export default class FormEntity extends BaseEntity {
  @IsOptional()
  job?: JobEntity;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  internalOrderNumber?: string;

  @IsString()
  @IsOptional()
  externalOrderNumber?: string;

  @IsObject()
  @IsOptional()
  client?: ClientEntity;

  @IsString()
  @IsOptional()
  owner?: string;

  @IsString()
  @IsOptional()
  objectNumber?: string;

  @IsObject()
  @IsOptional()
  tenant?: TenantEntity;

  @IsBoolean()
  @IsOptional()
  measurePower?: boolean;

  @IsObject()
  @IsOptional()
  billing?: BillingEntity;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  devices?: DeviceEntity[];

  @IsDate()
  @IsOptional()
  protocolDate?: Date;

  @IsString()
  @IsOptional()
  protocolText?: string;

  @IsArray()
  @IsOptional()
  articles?: ArticleEntity[];

  @IsArray()
  @IsOptional()
  expenses?: ExpenseEntity[];

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  freeText?: string;

  @IsArray()
  @IsOptional()
  images?: ImageFileEntity[];

  @IsArray()
  @IsOptional()
  imageStrings?: string[];

  @IsBoolean()
  @IsOptional()
  isPullable?: boolean;

  @IsDate()
  @IsOptional()
  pulledAt?: Date;

  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean;

  @IsBoolean()
  @IsOptional()
  isFinished?: boolean;
}
