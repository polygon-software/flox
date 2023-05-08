import { IsEnum, IsOptional } from 'class-validator';

import { JOB_STATUS, JOB_TYPE } from 'src/data/ENUM';

/**
 * A class representing an input object for creating a job data object
 */
export default class CreateJobInput {
  @IsEnum(JOB_TYPE)
  @IsOptional()
  type?: JOB_TYPE;

  @IsEnum(JOB_STATUS)
  @IsOptional()
  status?: JOB_STATUS;
}
