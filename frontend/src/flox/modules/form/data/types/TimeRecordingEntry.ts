/**
 * TimerRecordingEntry class containing the timer recording entry details
 */
export default class TimeRecordingEntry {
  name: string | null;

  timeAmount: number | null;

  discount: number | null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    taskType: string | null,
    duration: number | null,
    discount: number | null
  ) {
    this.name = taskType;
    this.timeAmount = duration;
    this.discount = discount;
  }

  /**
   * Determines whether the timer recording entry is complete
   * @returns - whether it's complete
   */
  isComplete(): boolean {
    return (
      this.name !== null && this.timeAmount !== null && this.discount !== null
    );
  }
}
