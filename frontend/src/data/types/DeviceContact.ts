
/**
 * A class representing a device contact
 */
export class DeviceContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  event: boolean;
  alarm1: boolean;
  alarm2: boolean;
  smsLimit: boolean;
  power: boolean;
  memory: boolean;
  daily: boolean;

  // eslint-disable-next-line require-jsdoc
  constructor(
    id: string,
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
    this.id = id;
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
