import { IsOptional, IsString } from 'class-validator';

import CreateJobInput from 'src/data/job/dto/input/createJobInput';

/**
 * A class representing an input object for updating a job data object
 */
export default class UpdateJobInput extends CreateJobInput {
  @IsString()
  @IsOptional()
  uuid?: string;
}
