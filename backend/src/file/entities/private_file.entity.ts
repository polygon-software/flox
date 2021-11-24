import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUrl } from 'class-validator';

@Entity()
@ObjectType()
export class PrivateFile extends BaseEntity {
  @Field(() => String, { description: 'File owner' })
  @Column()
  public owner: string; // TODO type UUID?

  @Field(() => String, { description: 'S3 File Key' })
  @Column()
  @IsString()
  public key: string;
}

export default PrivateFile;
