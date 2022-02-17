import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class GetPreviewArgs {
  @Field(() => String)
  @IsString()
  cli: string;

  @Field(() => String)
  @IsString()
  date: string;

  @Field(() => String)
  @IsString()
  num: string;
}
