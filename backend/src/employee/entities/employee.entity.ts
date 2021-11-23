import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';

@ObjectType()
export class Employee extends BaseEntity {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
