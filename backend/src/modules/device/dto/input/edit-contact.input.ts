import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

@InputType()
/**
 * Input for editing a device contact
 */
export class EditContactInput {
  @Field(() => Int, {
    description: 'Unique database ID',
  })
  @IsInt()
  id: number;

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
    description: 'Whether to trigger on power alert',
  })
  @IsBoolean()
  power: boolean;

  @Field(() => Boolean, {
    description: 'Whether to trigger on memory alert',
  })
  @IsBoolean()
  memory: boolean;

  @Field(() => Boolean, {
    description: 'Whether to trigger daily',
  })
  @IsBoolean()
  daily: boolean;
}
