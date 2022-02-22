import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MR2000 {
  @Field(() => String, { description: 'Device CLI ID' })
  cli: string;

  /**
   * Constructor
   * @param {string} cli - CLI ID
   */
  constructor(cli: string) {
    this.cli = cli;
  }
}
