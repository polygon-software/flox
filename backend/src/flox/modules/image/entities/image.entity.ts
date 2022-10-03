import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * Defines an image that wraps an S3 File
 */

@Entity()
@ObjectType()
export abstract class Image extends BaseEntity {
  @Field(() => String, { description: 'File UUID' })
  @Column()
  @IsUUID()
  public file: string;
}

export default Image;
