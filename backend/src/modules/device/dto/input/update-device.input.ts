import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
/**
 * Updates the Device Parameters Input
 */
export class UpdateDeviceParamsInput {
  @Field(() => String)
  cli: string;
  @Field(() => Float, { nullable: true })
  trigX: number;
  @Field(() => Float, { nullable: true })
  trigY: number;
  @Field(() => Float, { nullable: true })
  trigZ: number;
  @Field(() => Float, { nullable: true })
  ala1X: number;
  @Field(() => Float, { nullable: true })
  ala1Y: number;
  @Field(() => Float, { nullable: true })
  ala1Z: number;
  @Field(() => Float, { nullable: true })
  ala2X: number;
  @Field(() => Float, { nullable: true })
  ala2Y: number;
  @Field(() => Float, { nullable: true })
  ala2Z: number;
  @Field(() => String)
  ala1_mode: string;
  @Field(() => String)
  ala2_mode: string;
}
