import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { AccessControlledEntity } from '../../access-control/entities/access-controlled.entity';

/**
 * Defines a file within an AWS S3 bucket
 */

@Entity()
@ObjectType()
export abstract class S3File extends AccessControlledEntity {
  @Field(() => String, { description: 'S3 File Key' })
  @Column()
  @IsString()
  public key: string;

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

  @Field(() => Number, { description: 'Filesize in bytes' })
  @Column()
  @IsNumber()
  public size: number;
}

export default S3File;
