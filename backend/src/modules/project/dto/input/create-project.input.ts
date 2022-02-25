import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import { MR2000 } from '../../../../types/MR2000';
import { MR3000 } from '../../../../types/MR3000';

@InputType()
/**
 * Input for project creation
 */
export class CreateProjectInput {
  @Field(() => String, { description: 'Project name' })
  @IsString()
  name: string;

  @Field(() => [MR2000], { description: 'Associated MR2000 instances' })
  @IsArray()
  mr2000Instances: MR2000[];

  @Field(() => [MR3000], { description: 'Associated MR3000 instances' })
  @IsArray()
  mr3000Instances: MR3000[];
}
