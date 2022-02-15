import {Address} from 'src/data/types/Address';
import {ROLE, USER_STATUS} from '../../../../shared/definitions/ENUM';

/**
 * A class representing a company data object
 */
export class User {
  role: ROLE;
  status: USER_STATUS;
  uuid: string | null;
  fullName: string | null;
  username: string | null;
  address: Address | null;
  phone: string | null;
  email: string | null;
  birthdate: Date | null;
  disabledUntil: Date | null;
  documents?: Record<string, string>[];

  /**
   * Constructor
   * @param role
   * @param status
   * @param uuid
   * @param fullName
   * @param username
   * @param address
   * @param phone
   * @param email
   * @param birthdate
   * @param disabledUntil
   * @param documents
   */
  // eslint-disable-next-line require-jsdoc
  constructor(role: ROLE, status: USER_STATUS, uuid?: string, fullName?: string, username?: string, address?: Address,
              phone?: string, email?: string, birthdate?: Date, disabledUntil?: Date, documents?: Record<string, string>[]) {
    this.role = role
    this.status = status
    this.uuid = uuid ?? null
    this.fullName = fullName ?? null
    this.username = username ?? null
    this.address = address ?? null
    this.phone = phone ?? null
    this.email = email ?? null
    this.birthdate = birthdate ?? null
    this.disabledUntil = disabledUntil ?? null
    this.documents = documents ?? []
  }
}
