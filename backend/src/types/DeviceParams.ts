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

  // Modes
  @Field(() => Boolean)
  ala1_mode: boolean;
  @Field(() => Boolean)
  ala2_mode: boolean;

  // Edits
  @Field(() => Number)
  ala1_edit: number;
  @Field(() => Number)
  ala2_edit: number;

  // Comment
  @Field(() => String)
  comment: string;

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
    ala1_mode: boolean,
    ala2_mode: boolean,
    ala1_edit: number,
    ala2_edit: number,
    comment: string,
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
    this.ala1_mode = ala1_mode;
    this.ala2_mode = ala2_mode;
    this.ala1_edit = ala1_edit;
    this.ala2_edit = ala2_edit;
    this.comment = comment;
  }
}
