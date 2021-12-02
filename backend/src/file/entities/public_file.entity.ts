import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsUrl } from 'class-validator';

/**
 * Defines a public file within a public AWS S3 bucket
 */

@InputType('public_file')
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
