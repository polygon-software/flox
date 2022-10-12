import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';
import S3File from '../../file/entities/file.entity';

import Label from './label.entity';

/**
 * Defines an image that wraps an S3 File
 */

@Entity()
@ObjectType()
export default class Image extends AccessControlledEntity {
  @Field(() => S3File, { description: 'File' })
  @OneToOne(() => S3File, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  public file: S3File;

  @Field(() => Number, {
    nullable: true,
    description: 'Image Width in Pixels',
  })
  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  public width?: number;

  @Field(() => Number, {
    nullable: true,
    description: 'Image Height in Pixels',
  })
  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  public height?: number;

  @Field(() => Number, {
    nullable: true,
    description: 'GPS Latitude',
  })
  @Column({
    type: 'float8',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  public latitude?: number;

  @Field(() => Number, {
    nullable: true,
    description: 'GPS Longitude',
  })
  @Column({
    type: 'float8',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  public longitude?: number;

  @Field(() => Date, {
    nullable: true,
    description: 'Capture Date',
  })
  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  public capturedAt?: Date;

  @Field(() => [Label], {
    description: 'Labels of detected objects on image',
  })
  @OneToMany(() => Label, (label) => label.image)
  public labels: Label[];
}
