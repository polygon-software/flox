/**
 * Defines a cognito options field
 */
export default class CognitoOptions {
  setPassword?: boolean;

  password?: string;

  sendInvite?: boolean;

  // eslint-disable-next-line require-jsdoc
  constructor(setPassword?: boolean, password?: string, sendInvite?: boolean) {
    this.setPassword = setPassword;
    this.password = password;
    this.sendInvite = sendInvite;
  }

  /**
   * Determines whether options data is valid
   * @returns - whether the data is valid
   */
  isComplete(): boolean {
    return (
      this.sendInvite !== undefined &&
      ((!!this.setPassword && !!this.password) ||
        (!this.setPassword && !this.password))
    );
  }
}
