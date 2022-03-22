import { Field, ObjectType } from '@nestjs/graphql';

/**
 * A FTP log entry (row) in an FTP log file
 */

@ObjectType()
export class FTPLogEntry {
  @Field(() => Date)
  timestamp: Date;

  @Field(() => String)
  ip: string;

  @Field(() => String)
  path: string;

  constructor(timestamp: Date, ip: string, path: string) {
    this.timestamp = timestamp;
    this.ip = ip;
    this.path = path;
  }
}
