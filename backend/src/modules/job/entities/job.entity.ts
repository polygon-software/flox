import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { JOB_STATUS, JOB_TYPE, jobTypeStatuses } from '../../../ENUM/enum';
import BaseEntity from '../../../flox/core/base-entity/entities/base-entity.entity';

/**
 * Job entity
 */
@Entity()
@ObjectType()
export default class Job extends BaseEntity {
  @Field(() => JOB_TYPE, {
    description: 'Job type',
    nullable: true,
  })
  @Column({ type: 'enum', enum: JOB_TYPE })
  @IsEnum(JOB_TYPE)
  @IsOptional()
  type: JOB_TYPE;

  @Field(() => JOB_STATUS, {
    description: 'Job status',
    nullable: true,
  })
  @Column({ type: 'enum', enum: JOB_STATUS })
  @IsEnum(JOB_STATUS)
  @IsOptional()
  status: JOB_STATUS;

  /**
   * Ensure that the type and status match
   */
  @BeforeInsert()
  @BeforeUpdate()
  ensureTypeAndStatusMatch(): void {
    if (!jobTypeStatuses[this.type].includes(this.status)) {
      throw new Error(
        `Job type ${this.type} cannot have status ${this.status}`,
      );
    }
  }
}
