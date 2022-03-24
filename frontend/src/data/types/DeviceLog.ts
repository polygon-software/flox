import {DeviceLogEntry} from 'src/data/types/DeviceLogEntry';

/**
 * A device log from a log file
 */
export class DeviceLog {
  total: number;
  entries: DeviceLogEntry[];

  // eslint-disable-next-line require-jsdoc
  constructor(total: number, entries: DeviceLogEntry[]) {
    this.total = total;
    this.entries = entries;
  }
}
