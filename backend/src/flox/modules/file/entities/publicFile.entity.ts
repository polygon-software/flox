import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';
import S3File from './file.entity';

/**
 * Defines a public file within a public AWS S3 bucket
 */

@Entity()
@ObjectType()
export class PublicFile extends S3File {
  @Field(() => String, { description: 'Public download URL' })
  @Column()
  @IsUrl()
  public url: string;
}

export default PublicFile;
