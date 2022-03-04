import { Field, ObjectType } from '@nestjs/graphql';
import { LevelWritingPoint } from './LevelWritingPoint';

/**
 * One axis of a level writing (x, y or z) with station ID and data points.
 */
@ObjectType()
export class LevelWritingAxis {
  @Field(() => String, { description: 'Station ID' })
  name: string;

  @Field(() => [LevelWritingPoint], { description: 'Data Points' })
  data: LevelWritingPoint[];

  constructor(name: string, data: LevelWritingPoint[]) {
    this.name = name;
    this.data = data;
  }
}
