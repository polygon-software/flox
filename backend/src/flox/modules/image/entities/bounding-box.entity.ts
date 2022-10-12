import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToOne } from 'typeorm';
import { IsDecimal } from 'class-validator';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';

import Label from './label.entity';

@Entity()
@ObjectType()
export default class BoundingBox extends BaseEntity {
  @Field(() => Number, {
    description: 'Bounding-Box width in percentage of image width',
  })
  @Column('float8')
  @IsDecimal()
  public width: number;

  @Field(() => Number, {
    description: 'Bounding-Box height in percentage of image height',
  })
  @Column('float8')
  @IsDecimal()
  public height: number;

  @Field(() => Number, {
    description:
      'Bounding-Box position from the left side of the image, in percentage',
  })
  @Column('float8')
  @IsDecimal()
  public left: number;

  @Field(() => Number, {
    description:
      'Bounding-Box position from the top side of the image, in percentage',
  })
  @Column('float8')
  @IsDecimal()
  public top: number;

  @Field(() => Label, {
    description: 'Label to which the bounding box belongs',
  })
  @OneToOne(() => Label, { cascade: true, onDelete: 'CASCADE' })
  public label: Label;
}
