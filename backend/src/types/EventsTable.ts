import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EventsTableRow } from './EventsTableRow';

@ObjectType()
export class EventsTable {
  @Field(() => Int)
  lengthAll: number;

  @Field(() => Int)
  lengthEvt: number;

  @Field(() => Int)
  lengthZip: number;

  @Field(() => Int)
  lengthPk: number;

  @Field(() => [EventsTableRow])
  items: EventsTableRow[];

  constructor(
    lengthAll: number,
    lengthZip: number,
    lengthEvt: number,
    lengthPk: number,
    items: EventsTableRow[],
  ) {
    this.lengthAll = lengthAll;
    this.lengthZip = lengthZip;
    this.lengthEvt = lengthEvt;
    this.lengthPk = lengthPk;
    this.items = items;
  }
}
