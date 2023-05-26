import { IsEnum, IsOptional } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import { JOB_STATUS, JOB_TYPE } from 'src/data/ENUM';

/**
 * A class representing a job data object
 */
export default class JobEntity extends BaseEntity {
  @IsEnum(JOB_TYPE)
  @IsOptional()
  type?: JOB_TYPE;

  @IsEnum(JOB_STATUS)
  @IsOptional()
  status?: JOB_STATUS;
}
