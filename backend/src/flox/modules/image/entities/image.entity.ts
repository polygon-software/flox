import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import PrivateFile from '../../file/entities/privateFile.entity';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

/**
 * Defines an image that wraps an S3 S3File
 */

@Entity()
@ObjectType()
export abstract class Image extends BaseEntity {
  @Field(() => PrivateFile, { description: 'File' })
  @OneToOne(() => PrivateFile)
  @JoinColumn()
  public file: PrivateFile;

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
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  public latitude?: string;

  @Field(() => Number, {
    nullable: true,
    description: 'GPS Longitude',
  })
  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  public longitude?: string;

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
}

export default Image;
