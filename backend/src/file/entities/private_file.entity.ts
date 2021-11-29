import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { Company } from '../../company/entities/company.entity';
import { User } from '../../user/entities/user.entity';

/**
 * Defines a private file within a restricted AWS S3 bucket.
 * Note that URL is NOT stored within the database, as pre-signed, expiring URLs are created on-demand.
 */

@Entity()
@ObjectType()
@InputType('public_file')
export class PrivateFile extends BaseEntity {
  @Field(() => String, { description: 'File owner' })
  @Column()
  @IsUUID()
  owner: string;

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

  @Field(() => Company, {
    nullable: true,
    description: 'Company the file belongs to',
  })
  @ManyToOne(() => Company, (company) => company.documents)
  company: Company;
}

export default PrivateFile;
