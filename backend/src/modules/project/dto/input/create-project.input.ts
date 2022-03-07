import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
/**
 * Input for project creation
 */
export class CreateProjectInput {
  @Field(() => String, { description: 'Uuid of the user owning the project' })
  @IsString()
  userUuid: string;

  @Field(() => String, { description: 'Project name' })
  @IsString()
  name: string;

  @Field(() => [String], {
    description: 'Associated MR2000 instances',
    nullable: true,
  })
  @IsArray()
  mr2000instances: string[];

  @Field(() => [String], {
    description: 'Associated MR3000 instances',
    nullable: true,
  })
  @IsArray()
  mr3000instances: string[];
}
