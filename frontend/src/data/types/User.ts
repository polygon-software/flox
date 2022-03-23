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
  phone: string | null;
  birthdate: Date | null;
  projects: Project[] | null;
  devices: string[] | null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    role: ROLE,
    uuid: string,
    username: string,
    email: string,
    cognitoUuid: string,
    fullName?: string,
    phone?: string,
    birthdate?: Date,
    projects?: Project[],
    devices?: string[]
  ) {
    this.role = role;
    this.uuid = uuid;
    this.username = username;
    this.email = email;
    this.cognitoUuid = cognitoUuid;
    this.fullName = fullName ?? null;
    this.phone = phone ?? null;
    this.birthdate = birthdate ?? null;
    this.projects = projects ?? null;
    this.devices = devices ?? null;
  }
}
