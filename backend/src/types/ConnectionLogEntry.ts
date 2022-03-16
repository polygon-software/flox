import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * A device connection log entry in the 'logovp' databse
 */

@ObjectType()
export class ConnectionLogEntry {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  cli: string;

  @Field(() => Date)
  timestamp: Date;

  @Field(() => String)
  vpnIp: string;

  @Field(() => String)
  realIp: string;

  @Field(() => String)
  port: string;

  @Field(() => Int)
  traffic: number;

  @Field(() => String)
  reason: string;

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
