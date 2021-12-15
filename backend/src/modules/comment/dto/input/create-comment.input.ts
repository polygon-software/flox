import { InputType, Field } from '@nestjs/graphql';
import { User } from '../../../user/entities/user.entity';
import { IsString } from 'class-validator';
import { Product } from '../../../product/entities/product.entity';

@InputType()
export class CreateCommentInput {
  @Field(() => User)
  user: User;

  @Field(() => String)
  @IsString()
  content: string;

  @Field(() => Product)
  product: Product;
}
