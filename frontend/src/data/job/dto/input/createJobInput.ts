import { JOB_STATUS, JOB_TYPE } from 'src/data/ENUM';

/**
 * A class representing an input object for creating a job data object
 */
export default class CreateJobInput {
  type?: JOB_TYPE;

  status?: JOB_STATUS;
}
