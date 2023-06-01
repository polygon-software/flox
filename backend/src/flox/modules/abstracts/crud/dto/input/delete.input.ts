import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

@InputType()
export default class DeleteInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  softDelete: boolean;
}
