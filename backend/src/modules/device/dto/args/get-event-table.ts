import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetEventTable {
  @Field(() => String)
  stationId: string;
}
