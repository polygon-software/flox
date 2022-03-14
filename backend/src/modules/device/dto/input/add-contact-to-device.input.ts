import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsPhoneNumber, IsString } from 'class-validator';

@InputType()
/**
 * Input for adding a contact to a device
 */
export class AddContactToDeviceInput {
  @Field(() => String, {
    description: 'Device CLI',
  })
  @IsString()
  cli: string;

  @Field(() => String, {
    description: 'Name',
  })
  @IsString()
  name: string;

  @Field(() => String, {
    description: 'Phone number',
  })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => String, {
    description: 'E-Mail address',
  })
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => Boolean, {
    description: 'Whether to trigger on event',
  })
  @IsBoolean()
  event: boolean;

  @Field(() => Boolean, {
    description: 'Whether to trigger on alarm1',
  })
  @IsBoolean()
  alarm1: boolean;

  @Field(() => Boolean, {
    description: 'Whether to trigger on alarm2',
  })
  @IsBoolean()
  alarm2: boolean;

  @Field(() => Boolean, {
    description: 'Whether to trigger on SMS Limit',
  })
  @IsBoolean()
  smsLimit: boolean;

  @Field(() => Boolean, {
    description: 'Whether to trigger on performance/battery alert',
  })
  @IsBoolean()
  performanceOrBattery: boolean;

  @Field(() => Boolean, {
    description: 'Whether to trigger on reminders',
  })
  @IsBoolean()
  reminder: boolean;

  @Field(() => Boolean, {
    description: 'Whether to trigger daily',
  })
  @IsBoolean()
  daily: boolean;
}
