import { Field, ObjectType } from '@nestjs/graphql';
import { DeviceDataPoint } from './DeviceDataPoint';

@ObjectType()
export class DeviceDataAxis {
  @Field(() => String, { description: 'CLI ID' })
  stationId: string;

  @Field(() => [DeviceDataPoint], { description: 'Data Points' })
  data: DeviceDataPoint[];

  constructor(stationId: string, data: DeviceDataPoint[]) {
    this.stationId = stationId;
    this.data = data;
  }
}
