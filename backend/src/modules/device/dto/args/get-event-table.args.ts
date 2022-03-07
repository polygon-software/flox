import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetEventTableArgs {
  @Field(() => String)
  stationId: string;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;

  @Field(() => String, { nullable: true })
  filter: string;
}
