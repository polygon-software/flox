import { Field, Float, ObjectType } from '@nestjs/graphql';
import { LevelWritingAxis } from './LevelWritingAxis';

/**
 * Level writing for multiple stations. Includes max value over all data points.
 */
@ObjectType()
export class LevelWriting {
  @Field(() => [LevelWritingAxis], { description: 'X-axes' })
  x: LevelWritingAxis[];

  @Field(() => [LevelWritingAxis], { description: 'Y-axes' })
  y: LevelWritingAxis[];

  @Field(() => [LevelWritingAxis], { description: 'Z-axes' })
  z: LevelWritingAxis[];

  @Field(() => Float, { description: 'Max value' })
  max: number;

  constructor(
    x: LevelWritingAxis[],
    y: LevelWritingAxis[],
    z: LevelWritingAxis[],
    max: number,
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.max = max;
  }
}
