import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetPrivateFileArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => [Number], {
    nullable: true,
    description: 'URL expiration duration (in seconds); defaults to 15min',
  })
  @IsOptional()
  @IsNumber()
  expires;
}
