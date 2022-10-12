import {executeMutation} from 'src/helpers/data/data-helpers';
import {CREATE_USER} from 'src/data/mutations/USER';
import {DELETE_PRIVATE_FILE, DELETE_PUBLIC_FILE} from 'src/data/mutations/FILES';
import {CREATE_IMAGE, DELETE_IMAGE} from 'src/data/mutations/IMAGE';
import {PublicFile} from 'src/data/types/PublicFile';
import {ImageFile} from 'src/data/types/ImageFile';
import {User} from 'src/data/types/User';
import {PrivateFile} from 'src/data/types/PrivateFile';

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
  const { data } = await executeMutation<User>(CREATE_USER, {
    username,
    email,
    cognitoUuid,
  });
  return data ?? null;
}

/**
 * Deletes a public File
 * @param {string} uuid - uuid of public file
 * @returns {Promise<PublicFile|null>} Deleted File
 */
export async function deletePublicFile(uuid: string): Promise<PublicFile|null> {
  const { data } = await executeMutation<PublicFile>(DELETE_PUBLIC_FILE, {
    uuid,
  });
  return data ?? null;
}

/**
 * Deletes a private File
 * @param {string} uuid - uuid of private file
 * @returns {Promise<PrivateFile|null>} Deleted File
 */
export async function deletePrivateFile(uuid: string): Promise<PrivateFile|null> {
  const { data } = await executeMutation<PrivateFile>(DELETE_PRIVATE_FILE, {
    uuid,
  });
  return data ?? null;
}

/**
 * Creates an image from a file
 * @param {string} file - uuid of public/private file
 * @param {Boolean} objectRecognition - perform object recognition on image
 * @returns {Promise<ImageFile|null>} Created image
 */
export async function createImage(file: string, objectRecognition=false): Promise<ImageFile|null> {
  const { data } = await executeMutation<ImageFile>(CREATE_IMAGE, {
    file, objectRecognition
  });
  return data ?? null;
}

/**
 * Deletes an image including its file
 * @param {string} uuid - uuid of image
 * @returns {Promise<ImageFile|null>} Deleted Image
 */
export async function deleteImage(uuid: string): Promise<ImageFile|null> {
  const { data } = await executeMutation<ImageFile>(DELETE_IMAGE, {
    uuid
  });
  return data ?? null;
}
