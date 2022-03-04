import { Address } from 'src/data/types/Address';
import { Project } from 'src/data/types/Project';
import { ROLE } from 'src/data/ENUM';

/**
 * A class representing a user data object
 */
export class User {
  role: ROLE;
  uuid: string;
  username: string;
  email: string;
  cognitoUuid: string;
  fullName: string | null;
  address: Address | null;
  phone: string | null;
  birthdate: Date | null;
  projects: Project[] | null;
  mr2000instances: string[] | null;
  mr3000instances: string[] | null;



  /**
   * Constructor
   * @param role
   * @param uuid
   * @param username
   * @param fullName
   * @param address
   * @param phone
   * @param email
   * @param birthdate
   * @param cognitoUuid
   * @param projects
   * @param mr2000instances
   * @param mr3000instances
   */
  // eslint-disable-next-line require-jsdoc
  constructor(role: ROLE,
              uuid: string,
              username: string,
              email: string,
              cognitoUuid: string,
              fullName?: string,
              address?: Address,
              phone?: string,
              birthdate?: Date,
              projects?: Project[],
              mr2000instances?: string[],
              mr3000instances?: string[],){
    this.role = role
    this.uuid = uuid
    this.username = username
    this.email = email
    this.cognitoUuid = cognitoUuid
    this.fullName = fullName ?? null
    this.address = address ?? null
    this.phone = phone ?? null
    this.birthdate = birthdate ?? null
    this.projects = projects ?? null
    this.mr2000instances = mr2000instances ?? null
    this.mr3000instances = mr3000instances ?? null
  }
}
