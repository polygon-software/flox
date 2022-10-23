import { PrivateFileEntity } from 'src/flox/modules/file/entities/privateFile.entity';
import {
  ALL_MY_FILES,
  ALL_PUBLIC_FILES,
  GET_PRIVATE_FILE,
  GET_PUBLIC_FILE,
} from 'src/flox/modules/file/file.query';
import { PublicFileEntity } from 'src/flox/modules/file/entities/publicFile.entity';
import { Ref } from 'vue';
import {
  DELETE_PRIVATE_FILE,
  DELETE_PUBLIC_FILE,
} from 'src/flox/modules/file/file.mutation';
import { executeQuery, subscribeToQuery } from 'src/apollo/query';
import { executeMutation } from 'src/apollo/mutation';

/**
 * Fetches a private file
 * @param {string} uuid - uuid of private file
 * @returns {Promise<PrivateFileEntity|null>} Private File
 */
export async function fetchPrivateFile(
  uuid: string
): Promise<PrivateFileEntity | null> {
  const { data } = await executeQuery<PrivateFileEntity>(GET_PRIVATE_FILE, {
    uuid,
  });
  return data;
}
/**
 * Fetches a public file
 * @param {string} uuid - uuid of public file
 * @returns {Promise<PublicFileEntity|null>} Public File
 */
export async function fetchPublicFile(
  uuid: string
): Promise<PublicFileEntity | null> {
  const { data } = await executeQuery<PublicFileEntity>(GET_PUBLIC_FILE, {
    uuid,
  });
  return data;
}

/**
 * Fetches a number of public files
 * @param {number} [take] - maximum number of files to load
 * @param {number} [skip] - number of files to skip before loading next bunch, used for pagination
 * @returns {Ref<PublicFileEntity[]>} List of public Files
 */
export function fetchPublicFiles(
  take?: number,
  skip?: number
): Ref<PublicFileEntity[]> {
  const { data } = subscribeToQuery<PublicFileEntity[]>(ALL_PUBLIC_FILES, {
    take,
    skip,
  });
  return data;
}

/**
 * Fetches files of logged-in user
 * @param {number} [take] - maximum number of files to load
 * @param {number} [skip] - number of files to skip before loading next bunch, used for pagination
 * @returns {Ref<PrivateFileEntity[]>} List of private Files
 */
export function fetchMyFiles(
  take?: number,
  skip?: number
): Ref<PrivateFileEntity[]> {
  const { data } = subscribeToQuery<PrivateFileEntity[]>(ALL_MY_FILES, {
    take,
    skip,
  });
  return data;
}

/**
 * Deletes a public File
 * @param {string} uuid - uuid of public file
 * @returns {Promise<PublicFileEntity|null>} Deleted File
 */
export async function deletePublicFile(
  uuid: string
): Promise<PublicFileEntity | null> {
  const { data } = await executeMutation<PublicFileEntity>(DELETE_PUBLIC_FILE, {
    uuid,
  });
  return data ?? null;
}

/**
 * Deletes a private File
 * @param {string} uuid - uuid of private file
 * @returns {Promise<PrivateFileEntity|null>} Deleted File
 */
export async function deletePrivateFile(
  uuid: string
): Promise<PrivateFileEntity | null> {
  const { data } = await executeMutation<PrivateFileEntity>(
    DELETE_PRIVATE_FILE,
    {
      uuid,
    }
  );
  return data ?? null;
}
