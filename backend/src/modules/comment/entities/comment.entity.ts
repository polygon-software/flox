import { ObjectType, Field } from '@nestjs/graphql';
import { ManyToOne, Column } from 'typeorm';
import { IsString } from 'class-validator';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';


@ObjectType()
export default class Comment {
  @Field(() => User, { description: 'The user who wrote this comment' })
  @Column()
  user: User;

  @Field(() => String, { description: 'Content' })
  @Column()
  @IsString()
  content: string;

  @Field(() => Product, { description: 'The product this a comment belongs to' })
  @ManyToOne(() => Product, (product) => product.comments)
  product: Product;
}
