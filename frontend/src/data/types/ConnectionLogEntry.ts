/**
 * A device connection log entry in the 'logovp' databse
 */
export class ConnectionLogEntry {
  id: number;
  cli: string;
  timestamp: Date;
  vpnIp: string;
  realIp: string;
  port: string;
  traffic: number;
  reason: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
    id: number,
    cli: string,
    timestamp: Date,
    vpnIp: string,
    realIp: string,
    port: string,
    traffic: number,
    reason: string,
  ) {
    this.id = id;
    this.cli = cli;
    this.timestamp = timestamp;
    this.vpnIp = vpnIp;
    this.realIp = realIp;
    this.port = port;
    this.traffic = traffic;
    this.reason = reason;
  }
}
