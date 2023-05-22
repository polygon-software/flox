import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { JOB_STATUS, JOB_TYPE } from '../../../ENUM/enum';
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
    const compatibleStatusMap = {
      [JOB_TYPE.NONE]: [JOB_STATUS.NONE],
      [JOB_TYPE.APPOINTMENT]: [JOB_STATUS.OPEN, JOB_STATUS.TERMINATED],
      [JOB_TYPE.EXTERNAL_SERVICE]: [
        JOB_STATUS.OPEN,
        JOB_STATUS.PENDING,
        JOB_STATUS.RECEIVED,
      ],
      [JOB_TYPE.OFFER]: [
        JOB_STATUS.OPEN,
        JOB_STATUS.PENDING,
        JOB_STATUS.RECEIVED,
      ],
      [JOB_TYPE.MATERIAL_ORDER]: [
        JOB_STATUS.OPEN,
        JOB_STATUS.ORDERED,
        JOB_STATUS.RECEIVED,
      ],
      [JOB_TYPE.NEW_DEVICES]: [
        JOB_STATUS.OPEN,
        JOB_STATUS.ORDERED,
        JOB_STATUS.RECEIVED,
      ],
    };

    if (!compatibleStatusMap[this.type].includes(this.status)) {
      throw new Error(
        `Job type ${this.type} cannot have status ${this.status}`,
      );
    }
  }
}
