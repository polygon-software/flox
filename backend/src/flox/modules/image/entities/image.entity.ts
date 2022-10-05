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
    defaultValue: null,
    description: 'Image Width in Pixels',
  })
  @Column()
  @IsOptional()
  @IsNumber()
  public width?: number;

  @Field(() => Number, {
    nullable: true,
    defaultValue: null,
    description: 'Image Height in Pixels',
  })
  @Column()
  @IsOptional()
  @IsNumber()
  public height?: number;

  @Field(() => Number, {
    nullable: true,
    defaultValue: null,
    description: 'GPS Latitude',
  })
  @Column()
  @IsOptional()
  @IsNumber()
  public latitude?: string;

  @Field(() => Number, {
    nullable: true,
    defaultValue: null,
    description: 'GPS Longitude',
  })
  @Column()
  @IsOptional()
  @IsNumber()
  public longitude?: string;

  @Field(() => Date, {
    nullable: true,
    defaultValue: null,
    description: 'Capture Date',
  })
  @Column()
  @IsOptional()
  @IsDate()
  public capturedAt?: Date;
}

export default Image;
