import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MR3000 {
  @Field(() => String, { description: 'CLI ID' })
  cli: string;

  @Field(() => String, { description: 'Serial number' })
  serialNumber: string;

  /**
   * Constructor
   * @param {string} cli - CLI ID
   * @param {string} serialNumber - Serial Number
   */
  constructor(cli: string, serialNumber: string) {
    this.cli = cli;
    this.serialNumber = serialNumber;
  }
}
