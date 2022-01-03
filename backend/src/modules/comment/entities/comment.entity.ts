import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { ManyToOne, Column, Entity } from 'typeorm';
import { IsString } from 'class-validator';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';


@ObjectType()
@Entity({ name: 'comment' })
@InputType('comment')
export class Comment extends BaseEntity {
  @Field(() => User, { description: 'The user who wrote this comment' })
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Field(() => String, { description: 'Content' })
  @Column()
  @IsString()
  content: string;

  @Field(() => Product, { description: 'The product this comment belongs to' })
  @ManyToOne(() => Product, (product) => product.comments)
  product: Product;
}

//TODO Add missing fields (likes, replies, etc.)
