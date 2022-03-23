import { ObjectType, Field } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
/**
 * An application Project
 */
export class Project extends BaseEntity {
  @Field(() => String, { description: 'Project Name' })
  @Column('text')
  @IsString()
  name: string;

  @Field(() => User, { description: 'User that owns the project' })
  @ManyToOne(() => User, (user) => user.projects, {
    eager: true,
  })
  user: User;

  @Field(() => [String], { description: 'Devices that the user has access to' })
  @Column('simple-array', { nullable: true })
  @IsArray()
  devices: string[];

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks() {
    if (!this.devices) {
      this.devices = [];
    }
  }
}
