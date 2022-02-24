import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MR3000 {
  @Field(() => String, { description: 'CLI ID' })
  cli: string;

  /**
   * Constructor
   * @param {string} cli - CLI ID
   */
  constructor(cli: string) {
    this.cli = cli;
  }
}
