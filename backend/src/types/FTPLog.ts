import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FTPLogEntry } from './FTPLogEntry';

/**
 * An FTP log from an FTP log file
 */
@ObjectType()
export class FTPLog {
  @Field(() => Int)
  total: number;

  @Field(() => [FTPLogEntry])
  entries: FTPLogEntry[];

  constructor(total: number, entries: FTPLogEntry[]) {
    this.total = total;
    this.entries = entries;
  }
}
