import { executeMutation } from 'src/apollo/mutation';
import { executeQuery } from 'src/apollo/query';
import ImageEntity from 'src/flox/modules/image/entities/image.entity';
import {
  CREATE_IMAGE,
  DELETE_IMAGE,
} from 'src/flox/modules/image/image.mutation';
import {
  GET_ALL_IMAGES,
  GET_ALL_MY_IMAGES,
  GET_IMAGE,
  GET_IMAGE_FOR_FILE,
  GET_IMAGES,
  GET_MY_IMAGES,
  SEARCH_IMAGES,
  SEARCH_MY_IMAGES,
} from 'src/flox/modules/image/image.query';
import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';

/**
 * Fetches a private image
 *
 * @param uuid - uuid of private image
 * @param expires - number of seconds in which the image link shall expire
 * @returns Private image
 */
export async function getImage(
  uuid: string,
  expires?: number
): Promise<ImageEntity> {
  const { data } = await executeQuery<ImageEntity>(GET_IMAGE, {
    uuid,
    expires,
  });
  return data;
}

/**
 * Fetches list of images given their uuids
 *
 * @param uuids - uuids of images to fetch
 * @param expires - number of seconds in which the image link shall expire
 * @returns images
 */
export async function getImages(
  uuids: string[],
  expires?: number
): Promise<ImageEntity[]> {
  const { data } = await executeQuery<ImageEntity[]>(GET_IMAGES, {
    uuids,
    expires,
  });
  return data;
}

/**
 * Fetch images that belong to the user
 *
 * @param uuids - uids of images to fetch
 * @param expires - number of seconds in which the image link shall expire
 * @returns users fils
 */
export async function getMyImages(
  uuids: string[],
  expires?: number
): Promise<ImageEntity[]> {
  const { data } = await executeQuery<ImageEntity[]>(GET_MY_IMAGES, {
    uuids,
    expires,
  });
  return data;
}

/**
 * Fetches all images with pagination
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param expires - number of seconds in which the image link shall expire
 * @returns images matching the path
 */
export async function getAllImages(
  take: number,
  skip: number,
  expires?: number
): Promise<ImageEntity[]> {
  const { data } = await executeQuery<ImageEntity[]>(GET_ALL_IMAGES, {
    skip,
    take,
    expires,
  });
  return data;
}

/**
 * Fetches all images of user with pagination
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param expires - number of seconds in which the image link shall expire
 * @returns users images matching the path
 */
export async function getAllMyImages(
  take: number,
  skip: number,
  expires?: number
): Promise<ImageEntity[]> {
  const { data } = await executeQuery<ImageEntity[]>(GET_ALL_MY_IMAGES, {
    skip,
    take,
    expires,
  });
  return data;
}

/**
 * Returns an image for a given image uuid
 *
 * @param file - uuid of image
 * @param expires - number of seconds in which the file link shall expire
 * @returns Image file belonging to File
 */
export async function getImageForFile(
  file: string,
  expires?: number
): Promise<ImageEntity> {
  const { data } = await executeQuery<ImageEntity>(GET_IMAGE_FOR_FILE, {
    file,
    expires,
  });
  return data;
}

/**
 * Searches for image
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param filter - search term for imagename
 * @param sortBy - column name to sort by
 * @param descending - sort ascending or descending
 * @param expires - number of seconds in which the image link shall expire
 * @returns search output object
 */
export async function searchImages(
  take: number,
  skip: number,
  filter: string,
  sortBy: string,
  descending: boolean,
  expires?: number
): Promise<CountQuery<ImageEntity>> {
  const { data } = await executeQuery<CountQuery<ImageEntity>>(SEARCH_IMAGES, {
    take,
    skip,
    filter,
    sortBy,
    descending,
    expires,
  });
  return data;
}

/**
 * Searches for users images
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param filter - search term for imagename
 * @param sortBy - column name to sort by
 * @param descending - sort ascending or descending
 * @param expires - number of seconds in which the image link shall expire
 * @returns search output object
 */
export async function searchMyImages(
  take: number,
  skip: number,
  filter: string,
  sortBy: string,
  descending: boolean,
  expires?: number
): Promise<CountQuery<ImageEntity>> {
  const { data } = await executeQuery<CountQuery<ImageEntity>>(
    SEARCH_MY_IMAGES,
    {
      take,
      skip,
      filter,
      sortBy,
      descending,
      expires,
    }
  );
  return data;
}

/**
 * Creates an image from a file
 *
 * @param file - uuid of public/private file
 * @param objectRecognition - perform object recognition on image
 * @returns Created image
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
 *
 * @param uuid - uuid of image
 * @returns Deleted Image
 */
export async function deleteImage(uuid: string): Promise<ImageEntity | null> {
  const { data } = await executeMutation<ImageEntity>(DELETE_IMAGE, {
    uuid,
  });
  return data ?? null;
}
