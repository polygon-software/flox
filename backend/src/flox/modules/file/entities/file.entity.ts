import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

import AccessControlledEntity from '../../access-control/entities/access-controlled.entity';

/**
 * Defines a file within an AWS S3 bucket
 */

@Entity()
@ObjectType()
export default abstract class S3File extends AccessControlledEntity {
  @Field(() => String, {
    nullable: true,
    description: 'Pre-signed download URL',
  })
  @IsOptional()
  @IsUrl()
  public url?: string;

  @Field(() => String, { description: 'Files mime type' })
  @Column()
  @IsString()
  public mimetype: string;

  @Field(() => String, {
    nullable: true,
    description: 'Name of File',
  })
  @Column()
  @IsOptional()
  @IsString()
  public filename: string;

  @Field(() => String, {
    nullable: true,
    description: 'Path that leads to file',
  })
  @Column()
  @IsOptional()
  @IsString()
  public path: string;

  @Field(() => Number, { description: 'Filesize in bytes' })
  @Column()
  @IsNumber()
  public size: number;

  @Field(() => String, {
    nullable: true,
    description: 'Signed URL to upload object. Only works 1 time',
  })
  @IsString()
  @IsOptional()
  public signedUrl?: string;
}
