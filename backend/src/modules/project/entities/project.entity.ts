import { ObjectType, Field } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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

  @Field(() => [String], {
    description: 'MR2000 instances that the user has access to',
    nullable: true,
  })
  @Column('text', { array: true, nullable: true })
  @IsArray()
  mr2000instances: string[];

  @Field(() => [String], {
    description: 'MR3000 instances that the user has access to',
    nullable: true,
  })
  @Column('text', { array: true, nullable: true })
  @IsArray()
  mr3000instances: string[];
}
