import { Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import S3File from '../../../flox/modules/file/entities/file.entity';
import Form from '../../form/entities/form.entity';

/**
 * Image entity
 */
@Entity()
@ObjectType()
export default class ImageFile extends S3File {
  @Field(() => Form, { description: 'Form the image belongs to' })
  @ManyToOne(() => Form, (form) => form.images)
  form: Form;
}
