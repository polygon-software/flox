import { executeMutation } from 'src/apollo/mutation';
import { executeQuery } from 'src/apollo/query';
import { ImageEntity } from 'src/flox/modules/image/entities/image.entity';
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
 * Returns an image for a given uuid
 * @param uuid - uuid of image
 * @returns Image File
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

export async function getAllImages(
  skip: number,
  take: number,
  expires?: number
): Promise<ImageEntity[]> {
  const { data } = await executeQuery<ImageEntity[]>(GET_ALL_IMAGES, {
    skip,
    take,
    expires,
  });
  return data;
}

export async function getAllMyImages(
  skip: number,
  take: number,
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
 * Returns an image for a given file uuid
 * @param file - uuid of image
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

export async function searchImages(
  skip: number,
  take: number,
  filter: string,
  sortBy: string,
  descending: boolean,
  expires?: number
): Promise<CountQuery<ImageEntity>> {
  const { data } = await executeQuery<CountQuery<ImageEntity>>(SEARCH_IMAGES, {
    skip,
    take,
    filter,
    sortBy,
    descending,
    expires,
  });
  return data;
}

export async function searchMyImages(
  skip: number,
  take: number,
  filter: string,
  sortBy: string,
  descending: boolean,
  expires?: number
): Promise<CountQuery<ImageEntity>> {
  const { data } = await executeQuery<CountQuery<ImageEntity>>(
    SEARCH_MY_IMAGES,
    {
      skip,
      take,
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
 * @param uuid - uuid of image
 * @returns Deleted Image
 */
export async function deleteImage(uuid: string): Promise<ImageEntity | null> {
  const { data } = await executeMutation<ImageEntity>(DELETE_IMAGE, {
    uuid,
  });
  return data ?? null;
}
