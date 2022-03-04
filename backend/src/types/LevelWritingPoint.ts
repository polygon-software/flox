import { Field, Float, ObjectType } from '@nestjs/graphql';

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
