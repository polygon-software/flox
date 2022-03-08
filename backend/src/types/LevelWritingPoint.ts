import { Field, Float, ObjectType } from '@nestjs/graphql';

/**
 * Single data point of a level writing. Time is on x-axis and level writing on y-axis.
 */
@ObjectType()
export class LevelWritingPoint {
  @Field(() => Date, { description: 'Timestamp' })
  x: Date;

  @Field(() => Float, { description: 'Value', nullable: true })
  y: number;

  constructor(x: Date, y: number) {
    this.x = x;
    this.y = y;
  }
}
