import {executeMutation} from 'src/helpers/data/data-helpers';
import {mapUser} from 'src/helpers/data/mapping-helpers';
import {CREATE_USER} from 'src/data/mutations/USER';
import {DELETE_PRIVATE_FILE, DELETE_PUBLIC_FILE} from 'src/data/mutations/FILES';
import {PublicFile} from 'src/data/types/PublicFile';
import {User} from 'src/data/types/User';
import {PrivateFile} from 'src/data/types/PrivateFile';
import {CREATE_IMAGE, DELETE_IMAGE} from 'src/data/mutations/IMAGE';
import {ImageFile} from 'src/data/types/ImageFile';

/**
 * This file contains all helper functions for mutating data using GraphQL mutations
 */

/**
 * Creates a user
 * @param {string} username - user's username (may be identical to e-mail)
 * @param {string} email - user's e-mail address
 * @param {string} cognitoUuid - user's Cognito UUID
 * @returns {Promise<User|null>} - the newly created user
 */
export async function createUser(username: string, email: string, cognitoUuid: string): Promise<User|null> {
  const mutationResult = await executeMutation(CREATE_USER, {
    username,
    email,
    cognitoUuid
  });
  const user = (
    mutationResult?.data ? (mutationResult as Record<string, Record<string, unknown>>).data[CREATE_USER.cacheLocation] : null
  ) as Record<string, unknown> | null;
  return user ? mapUser(user) : null;
}

/**
 * Deletes a public File
 * @param {string} uuid - uuid of public file
 * @returns {Promise<PublicFile|null>} Deleted File
 */
export async function deletePublicFile(uuid: string): Promise<PublicFile|null> {
  const mutationResult = await executeMutation(DELETE_PUBLIC_FILE, {
    uuid,
  });
  return (mutationResult?.data ? (mutationResult as Record<string, Record<string, unknown>>).data[DELETE_PUBLIC_FILE.cacheLocation] : null) as PublicFile | null;
}

/**
 * Deletes a private File
 * @param {string} uuid - uuid of private file
 * @returns {Promise<PrivateFile|null>} Deleted File
 */
export async function deletePrivateFile(uuid: string): Promise<PrivateFile|null> {
  const mutationResult = await executeMutation(DELETE_PRIVATE_FILE, {
    uuid,
  });
  return (mutationResult?.data ? (mutationResult as Record<string, Record<string, unknown>>).data[DELETE_PRIVATE_FILE.cacheLocation] : null) as PrivateFile | null;
}

/**
 * Creates an image from a file
 * @param {string} file - uuid of public/private file
 * @param {Boolean} objectRecognition - perform object recognition on image
 * @returns {Promise<ImageFile|null>} Created image
 */
export async function createImage(file: string, objectRecognition=false): Promise<ImageFile|null> {
  const mutationResult = await executeMutation(CREATE_IMAGE, { file, objectRecognition });
  return (mutationResult?.data ? (mutationResult as Record<string, Record<string, unknown>>).data[CREATE_IMAGE.cacheLocation] : null) as ImageFile | null;
}

/**
 * Deletes an image including its file
 * @param {string} uuid - uuid of image
 * @returns {Promise<ImageFile|null>} Deleted Image
 */
export async function deleteImage(uuid: string): Promise<ImageFile|null> {
  const mutationResult = await executeMutation(DELETE_IMAGE, { uuid });
  return (mutationResult?.data ? (mutationResult as Record<string, Record<string, unknown>>).data[DELETE_IMAGE.cacheLocation] : null) as ImageFile | null;
}
