import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { IsNumber, IsString } from 'class-validator';
import { BoundingBox } from './bounding-box.entity';
import Image from './image.entity';

@Entity()
@ObjectType()
export class Label extends BaseEntity {
  @Field(() => Image, {
    description: 'Image on which this label was detected',
  })
  @ManyToOne(() => Image, (image) => image.labels)
  public image: Image;

  @Field(() => String, {
    description: 'Label Name',
  })
  @Column()
  @IsString()
  public name: string;

  @Field(() => Number, { description: 'Confidence between 0 and 100' })
  @Column('float8')
  @IsNumber()
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
  @OneToOne(() => BoundingBox)
  @JoinColumn()
  public boundingBox: BoundingBox;
}
