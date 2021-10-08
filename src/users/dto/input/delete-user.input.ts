import { CreateUserInput } from './create-user.input';
import { PartialType } from '@nestjs/mapped-types';
import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty, IsOptional} from "class-validator";

@InputType()
export class DeleteUserInput {
  @Field()
  @IsNotEmpty()
  userId: string;
}
