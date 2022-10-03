import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/base-entity/entities/base-entity.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * Defines a file within an AWS S3 bucket
 */

@Entity()
@ObjectType()
export class S3File extends BaseEntity {
  @Field(() => String, { description: 'S3 File Key' })
  @Column()
  @IsString()
  public key: string;

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
