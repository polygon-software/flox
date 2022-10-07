import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsUrl, IsUUID } from 'class-validator';
import S3File from './file.entity';

/**
 * Defines a private file within a restricted AWS S3 bucket.
 * Note that URL is NOT stored within the database, as pre-signed, expiring URLs are created on-demand.
 */

@Entity()
@ObjectType()
export class PrivateFile extends S3File {
  @Field(() => String, { description: 'File owner' })
  @Column()
  @IsUUID()
  public owner: string;

  @Field(() => String, {
    nullable: true,
    description: 'Pre-signed download URL',
  })
  @IsOptional()
  @IsUrl()
  public url: string;
}

export default PrivateFile;
