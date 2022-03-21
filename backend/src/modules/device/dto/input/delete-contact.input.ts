import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
/**
 * Input for deleting a device contact
 */
export class DeleteContactInput {
  @Field(() => Int, {
    description: 'Unique database ID',
  })
  @IsInt()
  id: number;

  @Field(() => String, {
    description: 'Device CLI',
  })
  @IsString()
  cli: string;
}
