import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export default class GetImageForFileArgs {
  @Field(() => ID)
  @IsUUID()
  file: string;

  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires: number;
}
