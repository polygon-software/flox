import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetImageArgs {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => [Number], {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires;
}
