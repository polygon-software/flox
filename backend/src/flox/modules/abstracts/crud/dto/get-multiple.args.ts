import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

@ArgsType()
export class GetMultipleArgs {
  @Field(() => [ID], { nullable: true })
  @IsArray()
  uuids: string[] = [];
}
