import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EventsTableRow } from './EventsTableRow';

@ObjectType()
export class EventsTable {
  @Field(() => Int)
  length: number;

  @Field(() => [EventsTableRow])
  items: EventsTableRow[];

  constructor(length: number, items: EventsTableRow[]) {
    this.length = length;
    this.items = items;
  }
}
