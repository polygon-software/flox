import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetEventTableArgs {
  @Field(() => String)
  stationId: string;

  @Field(() => String, { nullable: true })
  filter: string;
}
