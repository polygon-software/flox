import { JOB_STATUS, JOB_TYPE, jobTypeStatuses } from 'src/data/ENUM';

/**
 * Job class containing the job details
 */
export default class Job {
  jobType?: JOB_TYPE;

  jobStatus?: JOB_STATUS;

  // eslint-disable-next-line require-jsdoc
  constructor(jobType?: JOB_TYPE, jobStatus?: JOB_STATUS) {
    this.jobType = jobType;
    this.jobStatus = jobStatus;
  }

  /**
   * Determines whether it's a valid storable output
   * @returns - whether it's valid
   */
  isComplete(): boolean {
    if (!!this.jobType && !!this.jobStatus) {
      return jobTypeStatuses[this.jobType].includes(this.jobStatus);
    }
    return false;
  }
}
