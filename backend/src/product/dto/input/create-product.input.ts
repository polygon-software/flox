import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  description: string;

  // TODO: Images

  @Field(() => Int)
  @IsInt()
  value: number;

  @Field(() => Date)
  @IsDate()
  start: Date;

  @Field(() => Date)
  @IsDate()
  end: Date;

  // TODO: Possibly others
}
