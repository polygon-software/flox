/**
 * Database classes TODO more info
 */

// An address, matching AddressEntity in backend
export class Address{
  street: string;
  number: string;
  city: string;
  zip_code: string;

  constructor(street: string, number: string, city: string, zip_code: string) {
    this.street = street;
    this.number = number;
    this.city = city;
    this.zip_code = zip_code;
  }
}
