/**
 * TimerRecordingEntry class containing the timer recording entry details
 */
export default class TimeRecordingEntry {
  taskType: string | null;

  duration: number | null;

  discount: number | null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    taskType: string | null,
    duration: number | null,
    discount: number | null
  ) {
    this.taskType = taskType;
    this.duration = duration;
    this.discount = discount;
  }

  /**
   * Determines whether the timer recording entry is complete
   * @returns - whether it's complete
   */
  isComplete(): boolean {
    return (
      this.taskType !== null && this.duration !== null && this.discount !== null
    );
  }
}
