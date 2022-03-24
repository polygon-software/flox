import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@ArgsType()
export class GetConnectionLogCountArgs {
  @Field(() => String)
  @IsArray()
  cli: string;
}
