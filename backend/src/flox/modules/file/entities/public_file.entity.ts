import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUrl } from 'class-validator';

/**
 * Defines a public file within a public AWS S3 bucket
 */

@Entity()
@ObjectType()
export class PublicFile extends BaseEntity {
  @Field(() => String, { description: 'Public download URL' })
  @Column()
  @IsUrl()
  public url: string;

  @Field(() => String, { description: 'S3 File Key' })
  @Column()
  @IsString()
  public key: string;
}

export default PublicFile;
