import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Column } from 'typeorm';

@ObjectType()
export class Person extends BaseEntity {
  @Column()
  @Field(() => String, { description: 'First Name' })
  @IsString()
  first_name: string;

  @Column()
  @Field(() => String, { description: 'Last Name' })
  @IsString()
  last_name: string;

  @Column()
  @Field(() => String, { description: 'Mail' })
  @IsString()
  email: string;

  @Field(() => String, { description: 'Human-readable ID' })
  @Column()
  @IsString()
  readable_id: string;

  @Field(() => ID, {
    description: 'Date of account ban (if any)',
    nullable: true,
  })
  @Column()
  @IsDate()
  banned_at: Date;
}
