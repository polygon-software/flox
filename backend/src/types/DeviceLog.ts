import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DeviceLogEntry } from './DeviceLogEntry';

/**
 * A device log from a log file
 */
@ObjectType()
export class DeviceLog {
  @Field(() => Int)
  total: number;

  @Field(() => [DeviceLogEntry])
  entries: DeviceLogEntry[];

  constructor(total: number, entries: DeviceLogEntry[]) {
    this.total = total;
    this.entries = entries;
  }
}
