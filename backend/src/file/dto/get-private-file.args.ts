import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetPrivateFileArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => [Number], { nullable: true })
  @IsOptional()
  @IsNumber()
  expires;
}
