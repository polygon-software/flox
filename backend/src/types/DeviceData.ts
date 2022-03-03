import { Field, Float, ObjectType } from '@nestjs/graphql';
import { DeviceDataAxis } from './DeviceDataAxis';

@ObjectType()
export class DeviceData {
  @Field(() => DeviceDataAxis, { description: 'x-axis' })
  x: DeviceDataAxis;

  @Field(() => DeviceDataAxis, { description: 'y-axis' })
  y: DeviceDataAxis;

  @Field(() => DeviceDataAxis, { description: 'z-axis' })
  z: DeviceDataAxis;

  @Field(() => Float, { description: 'Max value' })
  max: number;

  constructor(
    x: DeviceDataAxis,
    y: DeviceDataAxis,
    z: DeviceDataAxis,
    max: number,
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.max = max;
  }
}
