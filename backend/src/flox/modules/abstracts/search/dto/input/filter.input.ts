import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export default class FilterInput {
  @Field(() => Boolean, {
    description: 'Whether is findable',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  findable?: boolean;
}
