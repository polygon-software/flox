import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateImageFileInput {
  @IsString()
  @IsOptional()
  filename?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  @IsOptional()
  mimetype?: string;

  @IsNumber()
  @IsOptional()
  size?: number;
}
