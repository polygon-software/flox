/**
 * A FTP log entry (row) in an FTP log file
 */
export class FTPLogEntry {
  timestamp: Date;
  ip: string;
  path: string;

  // eslint-disable-next-line require-jsdoc
  constructor(timestamp: Date, ip: string, path: string) {
    this.timestamp = timestamp;
    this.ip = ip;
    this.path = path
  }
}
