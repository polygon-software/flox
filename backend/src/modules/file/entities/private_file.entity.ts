import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { Company } from '../../company/entities/company.entity';
import { Dossier } from '../../dossier/entity/dossier.entity';
import { Offer } from '../../offer/entities/offer.entity';
import { FILE_TYPE } from '../../../ENUM/ENUMS';

/**
 * Defines a private file within a restricted AWS S3 bucket.
 * Note that URL is NOT stored within the database, as pre-signed, expiring URLs are created on-demand.
 */

@Entity()
@ObjectType()
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
  @ManyToOne(() => Company, (company) => company.documents, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @Field(() => Dossier, {
    nullable: true,
    description: 'Dossier the file belongs to',
  })
  @ManyToOne(() => Dossier, (dossier) => dossier.documents, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  dossier: Dossier;

  @Field(() => Offer, {
    nullable: true,
    description: 'Offer the file belongs to',
  })
  @ManyToOne(() => Offer, (offer) => offer.documents, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  offer: Offer;

  @Field(() => FILE_TYPE, { description: 'Type of the File' })
  @Column({
    type: 'enum',
    enum: FILE_TYPE,
    default: FILE_TYPE.NONE,
  })
  @IsString()
  file_type: FILE_TYPE;
}

export default PrivateFile;
