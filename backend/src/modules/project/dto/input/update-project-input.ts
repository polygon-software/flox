import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
/**
 * Input for updating a project
 */
export class UpdateProjectInput {
  @Field(() => ID, {
    description: 'Project UUID',
  })
  @IsUUID()
  uuid: string;

  @Field(() => String, {
    description: 'Project name',
  })
  @IsString()
  name: string;
}
