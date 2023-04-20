/**
 * Defines an e-mail repeat field
 */
export default class EmailRepeat {
  email?: string;

  emailRepeat?: string;

  // eslint-disable-next-line require-jsdoc
  constructor(email?: string) {
    this.email = email;
    this.emailRepeat = email;
  }

  /**
   * Determines whether the email data is valid
   * @returns - whether the data is valid
   */
  isComplete(): boolean {
    return (
      !!this.email && !!this.emailRepeat && this.email === this.emailRepeat
    );
  }
}
