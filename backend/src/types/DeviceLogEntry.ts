import { Field, ObjectType } from '@nestjs/graphql';

/**
 * A device log entry (row) in a log file
 */

@ObjectType()
export class DeviceLogEntry {
  @Field(() => Date)
  timestamp: Date;

  @Field(() => String)
  message: string;

  constructor(timestamp: Date, message: string) {
    this.timestamp = timestamp;
    this.message = message;
  }
}
