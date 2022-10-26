/**
 * Defines a password repeat field
 */
export default class PasswordRepeat {
  password?: string;

  passwordRepeat?: string;

  // eslint-disable-next-line require-jsdoc
  constructor(password?: string) {
    this.password = password;
    this.passwordRepeat = password;
  }

  /**
   * Determines whether the password data is valid
   * @returns - whether the data is valid
   */
  isComplete(): boolean {
    return (
      !!this.password &&
      !!this.passwordRepeat &&
      this.password === this.passwordRepeat
    );
  }
}
