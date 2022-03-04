import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsString } from 'class-validator';

@ObjectType()
@Entity()
/**
 * An application device
 */
export class Device extends BaseEntity {
  @Field(() => String, { description: 'Device Name' })
  @Column('text')
  @IsString()
  name: string;
}
