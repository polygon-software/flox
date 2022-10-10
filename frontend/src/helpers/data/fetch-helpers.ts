import {executeQuery} from 'src/helpers/data/data-helpers';
import {mapUser} from 'src/helpers/data/mapping-helpers';
import {MY_USER} from 'src/data/queries/USER';
import {User} from 'src/data/types/User';
import {ALL_MY_FILES, ALL_PUBLIC_FILES, GET_PRIVATE_FILE, GET_PUBLIC_FILE} from 'src/data/queries/FILES';
import {PrivateFile} from 'src/data/types/PrivateFile';
import {PublicFile} from 'src/data/types/PublicFile';
import {ImageFile} from 'src/data/types/ImageFile';
import {GET_IMAGE, GET_IMAGE_FOR_FILE} from 'src/data/queries/IMAGE';

/**
 * This file contains all helper functions for fetching data using GraphQL queries
 */

/**
 * Fetch the logged-in user
 * @returns {Promise<User|null>} - the logged-in user
 */
export async function fetchMyUser(): Promise<User|null> {
  const queryResult = await executeQuery(MY_USER);
  const user = (
    queryResult.data ? queryResult.data[MY_USER.cacheLocation] : null
  ) as Record<string, unknown> | null;
  return user ? mapUser(user) : null;
}

/**
 * Fetches a private file
 * @param {string} uuid - uuid of private file
 * @returns {Promise<PrivateFile|null>} Private File
 */
export async function fetchPrivateFile(uuid: string): Promise<PrivateFile|null> {
  const queryResult = await executeQuery(GET_PRIVATE_FILE, { uuid });
  const file = (
    queryResult.data ? queryResult.data[GET_PRIVATE_FILE.cacheLocation] : null
  ) as PrivateFile | null;
  return file ?? null;
}
/**
 * Fetches a public file
 * @param {string} uuid - uuid of public file
 * @returns {Promise<PublicFile|null>} Public File
 */
export async function fetchPublicFile(uuid: string): Promise<PublicFile|null> {
  const queryResult = await executeQuery(GET_PUBLIC_FILE, { uuid });
  const file = (
    queryResult.data ? queryResult.data[GET_PUBLIC_FILE.cacheLocation] : null
  ) as PublicFile | null;
  return file ?? null;
}

/**
 * Fetches a number of public files
 * @param {number} [limit] - maximum number of files to load
 * @param {number} [skip] - number of files to skip before loading next bunch, used for pagination
 * @returns {Promise<PublicFile[]>} List of public Files
 */
export async function fetchPublicFiles(limit?: number, skip?: number): Promise<PublicFile[]> {
  const queryResult = await executeQuery(ALL_PUBLIC_FILES, { limit, skip });
  const files = (
    queryResult.data ? queryResult.data[GET_PUBLIC_FILE.cacheLocation] : null
  ) as PublicFile[] | null;
  return files ?? [];
}

/**
 * Fetches files of logged-in user
 * @param {number} [limit] - maximum number of files to load
 * @param {number} [skip] - number of files to skip before loading next bunch, used for pagination
 * @returns {Promise<PrivateFile[]>} List of private Files
 */
export async function fetchMyFiles(limit?: number, skip?: number ): Promise<PrivateFile[]> {
  const queryResult = await executeQuery(ALL_MY_FILES, { limit, skip });
  const files = (
    queryResult.data ? queryResult.data[ALL_MY_FILES.cacheLocation] : null
  ) as PrivateFile[] | null;
  return files ?? [];
}

/**
 * Returns an image for a given uuid
 * @param {string} uuid - uuid of image
 * @returns {Promise<ImageFile|null>} Image File
 */
export async function getImage(uuid: string): Promise<ImageFile | null> {
  const queryResult = await executeQuery(GET_IMAGE, { uuid });
  const image = (
    queryResult.data ? queryResult.data[GET_IMAGE.cacheLocation] : null
  ) as ImageFile | null;
  return image ?? null;
}

/**
 * Returns an image for a given file uuid
 * @param {string} file - uuid of image
 * @returns {Promise<ImageFile|null>} Image file belonging to File
 */
export async function getImageForFile(file: string): Promise<ImageFile | null> {
  const queryResult = await executeQuery(GET_IMAGE_FOR_FILE, { file });
  const image = (
    queryResult.data ? queryResult.data[GET_IMAGE_FOR_FILE.cacheLocation] : null
  ) as ImageFile | null;
  return image ?? null;
}
