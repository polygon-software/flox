import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
/**
 * Input for updating a project
 */
export class UpdateProjectInput {
  @Field(() => String, {
    description: 'Project name',
  })
  @IsString()
  name: string;
}
