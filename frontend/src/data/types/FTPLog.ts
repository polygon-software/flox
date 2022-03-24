import {FTPLogEntry} from 'src/data/types/FTPLogEntry';

/**
 * An FTP log from a log file
 */
export class FTPLog {
  total: number;
  entries: FTPLogEntry[];

  // eslint-disable-next-line require-jsdoc
  constructor(total: number, entries: FTPLogEntry[]) {
    this.total = total;
    this.entries = entries;
  }
}
