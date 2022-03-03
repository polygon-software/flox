import { Field, ObjectType } from '@nestjs/graphql';
import { DeviceDataPoint } from './DeviceDataPoint';

@ObjectType()
export class DeviceDataAxis {
  @Field(() => String, { description: 'CLI ID' })
  name: string;

  @Field(() => [DeviceDataPoint], { description: 'Data Points' })
  data: DeviceDataPoint[];

  constructor(name: string, data: DeviceDataPoint[]) {
    this.name = name;
    this.data = data;
  }
}
