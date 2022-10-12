import {executeQuery, subscribeToQuery} from 'src/helpers/data/data-helpers';
import {mapUser} from 'src/helpers/data/mapping-helpers';
import {MY_USER} from 'src/data/queries/USER';
import {User} from 'src/data/types/User';
import {ALL_MY_FILES, ALL_PUBLIC_FILES, GET_PRIVATE_FILE, GET_PUBLIC_FILE} from 'src/data/queries/FILES';
import {PrivateFile} from 'src/data/types/PrivateFile';
import {PublicFile} from 'src/data/types/PublicFile';
import {ImageFile} from 'src/data/types/ImageFile';
import {GET_IMAGE, GET_IMAGE_FOR_FILE} from 'src/data/queries/IMAGE';
import {Ref} from 'vue';

/**
 * This file contains all helper functions for fetching data using GraphQL queries
 */

/**
 * Fetch the logged-in user
 * @returns {Promise<User|null>} - the logged-in user
 */
export async function fetchMyUser() {
  const user = await executeQuery<User>(MY_USER);
  return user ? mapUser(user) : null;
}

/**
 * Fetches a private file
 * @param {string} uuid - uuid of private file
 * @returns {Promise<PrivateFile|null>} Private File
 */
export async function fetchPrivateFile(uuid: string): Promise<PrivateFile|null> {
  const { data } = await executeQuery<PrivateFile>(GET_PRIVATE_FILE, { uuid });
  return data;
}
/**
 * Fetches a public file
 * @param {string} uuid - uuid of public file
 * @returns {Promise<PublicFile|null>} Public File
 */
export async function fetchPublicFile(uuid: string): Promise<PublicFile|null> {
  const { data } = await executeQuery<PublicFile>(GET_PUBLIC_FILE, { uuid });
  return data;
}

/**
 * Fetches a number of public files
 * @param {number} [limit] - maximum number of files to load
 * @param {number} [skip] - number of files to skip before loading next bunch, used for pagination
 * @returns {Ref<PublicFile[]>} List of public Files
 */
export function fetchPublicFiles(limit?: number, skip?: number): Ref<PublicFile[]> {
  const { data } = subscribeToQuery<PublicFile[]>(ALL_PUBLIC_FILES, { limit, skip });
  return data;
}

/**
 * Fetches files of logged-in user
 * @param {number} [limit] - maximum number of files to load
 * @param {number} [skip] - number of files to skip before loading next bunch, used for pagination
 * @returns {Ref<PrivateFile[]>} List of private Files
 */
export function fetchMyFiles(limit?: number, skip?: number ): Ref<PrivateFile[]> {
  const { data } = subscribeToQuery<PrivateFile[]>(ALL_MY_FILES, { limit, skip });
  return data;
}

/**
 * Returns an image for a given uuid
 * @param {string} uuid - uuid of image
 * @returns {Promise<ImageFile|null>} Image File
 */
export async function getImage(uuid: string): Promise<ImageFile | null> {
  const { data } = await executeQuery<ImageFile>(GET_IMAGE, { uuid });
  return data;
}

/**
 * Returns an image for a given file uuid
 * @param {string} file - uuid of image
 * @returns {Promise<ImageFile|null>} Image file belonging to File
 */
export async function getImageForFile(file: string): Promise<ImageFile | null> {
  const { data } = await executeQuery<ImageFile>(GET_IMAGE_FOR_FILE, { file });
  return data;
}
