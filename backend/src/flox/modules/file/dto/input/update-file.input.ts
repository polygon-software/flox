import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { UpdateInput } from '../../../abstracts/crud/inputs/update.input';

@InputType()
export class UpdateFileInput extends UpdateInput {
  @Field(() => String, {
    nullable: true,
    description: 'Name of File',
  })
  @Column()
  @IsOptional()
  @IsString()
  public filename: string;

  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires?: number;
}
