import { IsOptional, IsString } from 'class-validator';

import CreateJobInput from 'src/data/job/dto/input/createJobInput';
import { JOB_STATUS, JOB_TYPE } from 'src/data/ENUM';
import JobEntity from 'src/data/job/entities/jobEntity';

/**
 * A class representing an input object for updating a job data object
 */
export default class UpdateJobInput extends CreateJobInput {
  @IsString()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for CreateJobInput
   * @param [uuid] - The uuid of the job
   * @param [type] - The type of the job
   * @param [status] - The status of the job
   */
  constructor(type?: JOB_TYPE, status?: JOB_STATUS, uuid?: string) {
    super();
    this.uuid = uuid;
    this.type = type;
    this.status = status;
  }

  /**
   * Transform JobEntity to input
   * @param job - from db
   * @returns - The job input for update
   */
  static fromJob(job?: JobEntity): UpdateJobInput {
    return new UpdateJobInput(job?.type, job?.status, job?.uuid);
  }
}
