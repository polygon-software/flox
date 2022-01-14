import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { User } from '../../user/entities/user.entity';

/**
 * Defines a private file within a restricted AWS S3 bucket.
 * Note that URL is NOT stored within the database, as pre-signed, expiring URLs are created on-demand.
 */

@Entity()
@ObjectType()
export class PrivateFile extends BaseEntity {
  @Field(() => User, { description: 'File owner' })
  @Column()
  @IsUUID()
  owner: User;

  @Field(() => String, { description: 'S3 File Key' })
  @Column()
  @IsString()
  key: string;

  @Field(() => String, {
    nullable: true,
    description: 'Pre-signed download URL',
  })
  @IsOptional()
  @IsUrl()
  url: string;
}

export default PrivateFile;
