import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

import Form from '../../form/entities/form.entity';
import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';

/**
 * Image entity
 */
@Entity()
@ObjectType()
export default class ImageFile extends BaseEntity {
  @Field(() => Form, { description: 'Form the image belongs to' })
  @ManyToOne(() => Form, (form) => form.images, { onDelete: 'CASCADE' })
  @IsObject()
  form: Form;

  @Field(() => String, { description: 'Files mime type', nullable: true })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  public mimetype: string;

  @Field(() => String, {
    nullable: true,
    description: 'Name of File',
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  public filename: string;

  @Field(() => String, {
    nullable: true,
    description: 'Path that leads to file',
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  public path: string;

  @Field(() => Number, { description: 'Filesize in bytes', nullable: true })
  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  public size: number;
}
