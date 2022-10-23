import { ImageEntity } from 'src/flox/modules/image/entities/image.entity';
import {
  GET_IMAGE,
  GET_IMAGE_FOR_FILE,
} from 'src/flox/modules/image/image.query';
import {
  CREATE_IMAGE,
  DELETE_IMAGE,
} from 'src/flox/modules/image/image.mutation';
import { executeQuery } from 'src/apollo/query';
import { executeMutation } from 'src/apollo/mutation';

/**
 * Returns an image for a given uuid
 * @param {string} uuid - uuid of image
 * @returns {Promise<ImageEntity|null>} Image File
 */
export async function getImage(uuid: string): Promise<ImageEntity | null> {
  const { data } = await executeQuery<ImageEntity>(GET_IMAGE, { uuid });
  return data;
}

/**
 * Returns an image for a given file uuid
 * @param {string} file - uuid of image
 * @returns {Promise<ImageEntity|null>} Image file belonging to File
 */
export async function getImageForFile(
  file: string
): Promise<ImageEntity | null> {
  const { data } = await executeQuery<ImageEntity>(GET_IMAGE_FOR_FILE, {
    file,
  });
  return data;
}

/**
 * Creates an image from a file
 * @param {string} file - uuid of public/private file
 * @param {Boolean} objectRecognition - perform object recognition on image
 * @returns {Promise<ImageEntity|null>} Created image
 */
export async function createImage(
  file: string,
  objectRecognition = false
): Promise<ImageEntity | null> {
  const { data } = await executeMutation<ImageEntity>(CREATE_IMAGE, {
    file,
    objectRecognition,
  });
  return data ?? null;
}

/**
 * Deletes an image including its file
 * @param {string} uuid - uuid of image
 * @returns {Promise<ImageEntity|null>} Deleted Image
 */
export async function deleteImage(uuid: string): Promise<ImageEntity | null> {
  const { data } = await executeMutation<ImageEntity>(DELETE_IMAGE, {
    uuid,
  });
  return data ?? null;
}
