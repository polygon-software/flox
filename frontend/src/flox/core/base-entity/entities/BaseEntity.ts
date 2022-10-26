import { IsDate, IsOptional, IsUUID } from 'class-validator';

/**
 * Base entity class that others inherit from.
 * Includes unique UUID, as well as creation/modification/deletion timestamps
 */
export default class BaseEntity {
  @IsUUID()
  uuid: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @IsDate()
  @IsOptional()
  deletedAt?: Date;

  // eslint-disable-next-line require-jsdoc
  constructor(uuid: string) {
    this.uuid = uuid;
  }
}
