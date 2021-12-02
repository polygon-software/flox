import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

/**
 * Defines a private file within a restricted AWS S3 bucket.
 * Note that URL is NOT stored within the database, as pre-signed, expiring URLs are created on-demand.
 */

@InputType('private_file')
@Entity()
@ObjectType()
export class PrivateFile extends BaseEntity {
  @Field(() => String, { description: 'File owner' })
  @Column()
  @IsUUID()
  public owner: string;

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
  public url: string;
}

export default PrivateFile;
