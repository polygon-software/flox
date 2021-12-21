import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsInt, IsString } from 'class-validator';
import { Comment } from '../../comment/entities/comment.entity';

@ObjectType()
@Entity({ name: 'user' })
@InputType('user')
export class User extends BaseEntity {
  @Field(() => String, { description: 'Name' })
  @Column()
  @IsString()
  name: string;

  @Field(() => Int, { description: 'Age' })
  @Column()
  @IsInt()
  age: number;

  @Field(() => [Comment], { description: 'Comments written by the user' })
  @OneToMany(() => Comment, (comment) => comment.user, {
  cascade: true,
  eager: true,
  })
  comments: Comment[]
}
