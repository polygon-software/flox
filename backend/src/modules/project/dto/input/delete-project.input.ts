import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
/**
 * Input for deleting a project
 */
export class DeleteProjectInput {
  @Field(() => ID, {
    description: 'Project UUID',
  })
  @IsUUID()
  uuid: string;
}
