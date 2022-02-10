import { ArgsType, Field } from '@nestjs/graphql';
import { IsDate } from 'class-validator';

@ArgsType()
export class GetLogFilesArgs {
  @Field(() => Date)
  @IsDate()
  start: Date;

  @Field(() => Date)
  @IsDate()
  end: Date;
}
