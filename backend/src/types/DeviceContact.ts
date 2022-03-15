import { Field, Float, ObjectType } from '@nestjs/graphql';

/**
 * A contact for a device.
 */

@ObjectType()
export class DeviceContact {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => Boolean)
  event: boolean;

  @Field(() => Boolean)
  alarm1: boolean;

  @Field(() => Boolean)
  alarm2: boolean;

  @Field(() => Boolean)
  smsLimit: boolean;

  @Field(() => Boolean)
  power: boolean;

  @Field(() => Boolean)
  memory: boolean;

  @Field(() => Boolean)
  daily: boolean;

  constructor(
    name: string,
    email: string,
    phone: string,
    event: boolean,
    alarm1: boolean,
    alarm2: boolean,
    smsLimit: boolean,
    power: boolean,
    memory: boolean,
    daily: boolean,
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.event = event;
    this.alarm1 = alarm1;
    this.alarm2 = alarm2;
    this.smsLimit = smsLimit;
    this.power = power;
    this.memory = memory;
    this.daily = daily;
  }
}
