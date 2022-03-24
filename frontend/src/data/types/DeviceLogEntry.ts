/**
 * A device log entry (row) in a log file
 */
export class DeviceLogEntry {
  timestamp: Date;
  message: string;

  // eslint-disable-next-line require-jsdoc
  constructor(timestamp: Date, message: string) {
    this.timestamp = timestamp;
    this.message = message;
  }
}
