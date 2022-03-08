import { Field, Float, ObjectType } from '@nestjs/graphql';

/**
 * Parameters for a device.
 */

@ObjectType()
export class DeviceParams {
  // Triggers
  @Field(() => Float)
  trigX: number;
  @Field(() => Float)
  trigY: number;
  @Field(() => Float)
  trigZ: number;

  // Alarm 1
  @Field(() => Float)
  ala1X: number;
  @Field(() => Float)
  ala1Y: number;
  @Field(() => Float)
  ala1Z: number;

  // Alarm 2
  @Field(() => Float)
  ala2X: number;
  @Field(() => Float)
  ala2Y: number;
  @Field(() => Float)
  ala2Z: number;

  // Units
  @Field(() => String)
  unitX: string;
  @Field(() => String)
  unitY: string;
  @Field(() => String)
  unitZ: string;

  constructor(
    trigX: number,
    trigY: number,
    trigZ: number,
    ala1X: number,
    ala1Y: number,
    ala1Z: number,
    ala2X: number,
    ala2Y: number,
    ala2Z: number,
    unitX: string,
    unitY: string,
    unitZ: string,
  ) {
    this.trigX = trigX;
    this.trigY = trigY;
    this.trigZ = trigZ;
    this.ala1X = ala1X;
    this.ala1Y = ala1Y;
    this.ala1Z = ala1Z;
    this.ala2X = ala2X;
    this.ala2Y = ala2Y;
    this.ala2Z = ala2Z;
    this.unitX = unitX;
    this.unitY = unitY;
    this.unitZ = unitZ;
  }
}
