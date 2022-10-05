import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import PrivateFile from '../../file/entities/privateFile.entity';

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
}

export default Image;
