import {Address} from 'src/data/types/Address';
import { ROLE } from 'src/data/ENUM';

/**
 * A class representing a company data object
 */
export class User {
  role: ROLE;
  uuid: string | null;
  fullName: string | null;
  username: string | null;
  address: Address | null;
  phone: string | null;
  email: string | null;
  birthdate: Date | null;

  /**
   * Constructor
   * @param role
   * @param uuid
   * @param fullName
   * @param username
   * @param address
   * @param phone
   * @param email
   * @param birthdate
   */
  // eslint-disable-next-line require-jsdoc
  constructor(role: ROLE, uuid?: string, fullName?: string, username?: string, address?: Address,
              phone?: string, email?: string, birthdate?: Date){
    this.role = role
    this.uuid = uuid ?? null
    this.fullName = fullName ?? null
    this.username = username ?? null
    this.address = address ?? null
    this.phone = phone ?? null
    this.email = email ?? null
    this.birthdate = birthdate ?? null
  }
}
