/**
 * Full name class containing first, middle, last and second last name
 */
export default class FullName {
  firstName?: string;

  middleName?: string;

  lastName?: string;

  secondLastName?: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
    firstName?: string,
    middleName?: string,
    lastName?: string,
    secondLastName?: string
  ) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.secondLastName = secondLastName;
  }

  /**
   * Determines whether it's a valid storable output
   * @returns - whether it's valid
   */
  isComplete(): boolean {
    return (
      !!this.firstName ||
      !!this.middleName ||
      !!this.lastName ||
      !!this.secondLastName
    );
  }

  /**
   * Replaces empty strings in values with undefined
   */
  fixEmptyStrings(): void {
    if (this.firstName?.length === 0) {
      this.firstName = undefined;
    }
    if (this.middleName?.length === 0) {
      this.middleName = undefined;
    }
    if (this.lastName?.length === 0) {
      this.lastName = undefined;
    }
    if (this.secondLastName?.length === 0) {
      this.secondLastName = undefined;
    }
  }
}
