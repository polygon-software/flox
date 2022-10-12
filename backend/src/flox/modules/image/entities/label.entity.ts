import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { IsDecimal, IsString } from 'class-validator';

import BaseEntity from '../../../core/base-entity/entities/base-entity.entity';

import BoundingBox from './bounding-box.entity';
import Image from './image.entity';

@Entity()
@ObjectType()
export default class Label extends BaseEntity {
  @Field(() => Image, {
    description: 'Image on which this label was detected',
  })
  @ManyToOne(() => Image, (image) => image.labels, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public image: Image;

  @Field(() => String, {
    description: 'Label Name',
  })
  @Column()
  @IsString()
  public name: string;

  @Field(() => Number, { description: 'Confidence between 0 and 100' })
  @Column('float8')
  @IsDecimal()
  public confidence: number;

  @Field(() => [String], {
    description: 'Parent labels',
  })
  @Column('text', { array: true })
  @IsString({ each: true })
  public parents: string[];

  @Field(() => BoundingBox, {
    description: 'Bounding box for every instance of this label on image',
  })
  @OneToOne(() => BoundingBox, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  public boundingBox: BoundingBox;
}
