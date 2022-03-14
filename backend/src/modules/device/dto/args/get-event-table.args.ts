import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetEventTableArgs {
  @Field(() => String)
  cli: string;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;

  @Field(() => String, { nullable: true })
  filter: string;

  @Field(() => String, { nullable: true })
  orderBy: string;

  @Field(() => Boolean, { nullable: true })
  descending: boolean;
}
