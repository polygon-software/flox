import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
/**
 * Input for updating a project
 */
export class DeleteProjectInput {
  @Field(() => String, {
    description: 'Project uuid',
  })
  @IsString()
  uuid: string;

  @Field(() => String, {
    description: 'Project name',
  })
  @IsString()
  name: string;
}
