import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import S3File from '../../file/entities/file.entity';

/**
 * Defines an image that wraps an S3 S3File
 */

@Entity()
@ObjectType()
export abstract class Image extends BaseEntity {
  @Field(() => S3File, { description: 'File' })
  @OneToOne(() => S3File)
  @JoinColumn()
  public file: S3File;
}

export default Image;
