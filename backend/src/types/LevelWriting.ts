import { Field, Float, ObjectType } from '@nestjs/graphql';
import { LevelWritingAxis } from './LevelWritingAxis';

@ObjectType()
export class LevelWriting {
  @Field(() => [LevelWritingAxis], { description: 'x-axis' })
  x: LevelWritingAxis[];

  @Field(() => [LevelWritingAxis], { description: 'y-axis' })
  y: LevelWritingAxis[];

  @Field(() => [LevelWritingAxis], { description: 'z-axis' })
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
