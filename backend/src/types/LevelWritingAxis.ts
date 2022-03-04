import { Field, ObjectType } from '@nestjs/graphql';
import { LevelWritingPoint } from './LevelWritingPoint';

@ObjectType()
export class LevelWritingAxis {
  @Field(() => String, { description: 'CLI ID' })
  name: string;

  @Field(() => [LevelWritingPoint], { description: 'Data Points' })
  data: LevelWritingPoint[];

  constructor(name: string, data: LevelWritingPoint[]) {
    this.name = name;
    this.data = data;
  }
}
