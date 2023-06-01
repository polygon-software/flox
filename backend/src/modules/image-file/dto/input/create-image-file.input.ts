import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export default class CreateImageFileInput {
  @Field(() => String, { description: 'Files mime type', nullable: true })
  @IsString()
  @IsOptional()
  public mimetype: string;

  @Field(() => String, {
    nullable: true,
    description: 'Name of File',
  })
  @IsString()
  @IsOptional()
  public filename: string;

  @Field(() => String, {
    nullable: true,
    description: 'Path that leads to file',
  })
  @IsOptional()
  @IsString()
  public path: string;

  @Field(() => Number, { description: 'Filesize in bytes', nullable: true })
  @IsNumber()
  @IsOptional()
  public size: number;
}
