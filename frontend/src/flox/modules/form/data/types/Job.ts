import { JOB_STATUS, JOB_TYPE, jobTypeStatuses } from 'src/data/ENUM';

/**
 * Job class containing the job details
 */
export default class Job {
  type?: JOB_TYPE;

  status?: JOB_STATUS;

  // eslint-disable-next-line require-jsdoc
  constructor(jobType?: JOB_TYPE, jobStatus?: JOB_STATUS) {
    this.type = jobType;
    this.status = jobStatus;
  }

  /**
   * Determines whether it's a valid storable output
   * @returns - whether it's valid
   */
  isComplete(): boolean {
    if (!!this.type && !!this.status) {
      return jobTypeStatuses[this.type].includes(this.status);
    }
    return false;
  }
}
