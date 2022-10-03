import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class GetImageForFileArgs {
  @Field(() => ID)
  @IsUUID()
  file: string;

  @Field(() => [Number], {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires;
}
