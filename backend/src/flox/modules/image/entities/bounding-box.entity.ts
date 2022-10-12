import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { IsNumber } from 'class-validator';

@Entity()
@ObjectType()
export class BoundingBox extends BaseEntity {
  @Field(() => Number, {
    description: 'Bounding-Box width in percentage of image width',
  })
  @Column('float8')
  @IsNumber()
  public width: number;

  @Field(() => Number, {
    description: 'Bounding-Box height in percentage of image height',
  })
  @Column('float8')
  @IsNumber()
  public height: number;

  @Field(() => Number, {
    description:
      'Bounding-Box position from the left side of the image, in percentage',
  })
  @Column('float8')
  @IsNumber()
  public left: number;

  @Field(() => Number, {
    description:
      'Bounding-Box position from the top side of the image, in percentage',
  })
  @Column('float8')
  @IsNumber()
  public top: number;
}
