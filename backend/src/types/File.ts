/**
 * Since NodeJS does not know File as a valid input type, it is defined here
 */

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
}
