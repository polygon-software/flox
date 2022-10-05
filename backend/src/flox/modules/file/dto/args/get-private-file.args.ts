import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetPrivateFileArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires?: number;
}
