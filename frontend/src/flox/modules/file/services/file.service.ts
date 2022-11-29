import { executeMutation } from 'src/apollo/mutation';
import { executeQuery } from 'src/apollo/query';
import {
  ALL_MY_FILES,
  ALL_PUBLIC_FILES,
  GET_ALL_FILES,
  GET_ALL_FOLDERS,
  GET_FILE,
  GET_FILE_READ_ACCESS_GROUPS,
  GET_FILE_WRITE_ACCESS_GROUPS,
  GET_FILES,
  GET_MY_FILES,
  GET_MY_FOLDERS,
  GET_PUBLIC_FILES,
  GET_PUBLIC_FOLDERS,
  SEARCH_FILES,
  SEARCH_MY_FILES,
  SEARCH_PUBLIC_FILES,
} from 'src/flox/modules/file/file.query';
import FileEntity from 'src/flox/modules/file/entities/file.entity';
import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';
import {
  CREATE_FILE,
  DELETE_FILE,
  MANIPULATE_FILE_ACCESS_USER_GROUPS,
  UPDATE_FILE,
} from 'src/flox/modules/file/file.mutation';
import FolderEntity from 'src/flox/modules/file/entities/folder.entity';
import UserGroupEntity from 'src/flox/modules/access-control/entities/user-group.entity';

export type FileInputs = {
  loggedInReadAccess?: boolean;
  publicReadAccess?: boolean;
  readAccess?: string[];
  writeAccess?: string[];
  path?: string;
  expires?: number;
};

/**
 * Fetches a private file
 *
 * @param uuid - uuid of private file
 * @param expires - number of seconds in which the file link shall expire
 * @returns Private File
 */
export async function getFile(
  uuid: string,
  expires?: number
): Promise<FileEntity> {
  const { data } = await executeQuery<FileEntity>(GET_FILE, {
    uuid,
    expires,
  });
  return data;
}

/**
 * Returns all user groups that have read access to the file with the given uuid
 *
 * @param uuid - uuid of file
 * @returns list of user groups
 */
export async function getFileReadAccessUserGroups(
  uuid: string
): Promise<UserGroupEntity[]> {
  const { data } = await executeQuery<UserGroupEntity[]>(
    GET_FILE_READ_ACCESS_GROUPS,
    {
      uuid,
    }
  );
  return data;
}

/**
 * Returns all user groups that have write access to the file with the given uuid
 *
 * @param uuid - uuid of file
 * @returns list of user groups
 */
export async function getFileWriteAccessUserGroups(
  uuid: string
): Promise<UserGroupEntity[]> {
  const { data } = await executeQuery<UserGroupEntity[]>(
    GET_FILE_WRITE_ACCESS_GROUPS,
    {
      uuid,
    }
  );
  return data;
}

/**
 * Fetches list of files given their uuids
 *
 * @param uuids - uuids of files to fetch
 * @param expires - number of seconds in which the file link shall expire
 * @returns files
 */
export async function getFiles(
  uuids: string[],
  expires?: number
): Promise<FileEntity[]> {
  const { data } = await executeQuery<FileEntity[]>(GET_FILES, {
    uuids,
    expires,
  });
  return data;
}

/**
 * Fetch files that belong to the user
 *
 * @param uuids - uids of files to fetch
 * @param expires - number of seconds in which the file link shall expire
 * @returns users fils
 */
export async function getMyFiles(
  uuids: string[],
  expires?: number
): Promise<FileEntity[]> {
  const { data } = await executeQuery<FileEntity[]>(GET_MY_FILES, {
    uuids,
    expires,
  });
  return data;
}

/**
 * Fetches list of public files
 *
 * @param uuids - uuids of public files
 * @param expires - number of seconds in which the file link shall expire
 * @returns public files
 */
export async function getPublicFiles(
  uuids: string[],
  expires?: number
): Promise<FileEntity[]> {
  const { data } = await executeQuery<FileEntity[]>(GET_PUBLIC_FILES, {
    uuids,
    expires,
  });
  return data;
}

/**
 * Fetches all files with pagination
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param path - path from which on files shall be fetched
 * @param expires - number of seconds in which the file link shall expire
 * @returns files matching the path
 */
export async function getAllFiles(
  take: number,
  skip: number,
  path?: string,
  expires?: number
): Promise<FileEntity[]> {
  const { data } = await executeQuery<FileEntity[]>(GET_ALL_FILES, {
    skip,
    take,
    path,
    expires,
  });
  return data;
}

/**
 * Fetches all files of user with pagination
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param path - path from which on files shall be fetched
 * @param expires - number of seconds in which the file link shall expire
 * @returns users files matching the path
 */
export async function getAllMyFiles(
  take: number,
  skip: number,
  path?: string,
  expires?: number
): Promise<FileEntity[]> {
  const { data } = await executeQuery<FileEntity[]>(ALL_MY_FILES, {
    skip,
    take,
    path,
    expires,
  });
  return data;
}

/**
 * Fetches all public files with pagination
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param path - path from which on files shall be fetched
 * @param expires - number of seconds in which the file link shall expire
 * @returns public files matching the path
 */
export async function getAllPublicFiles(
  take: number,
  skip: number,
  path?: string,
  expires?: number
): Promise<FileEntity[]> {
  const { data } = await executeQuery<FileEntity[]>(ALL_PUBLIC_FILES, {
    skip,
    take,
    path,
    expires,
  });
  return data;
}

/**
 * Searches for files
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param filter - search term for filename
 * @param sortBy - column name to sort by
 * @param descending - sort ascending or descending
 * @param expires - number of seconds in which the file link shall expire
 * @returns search output object
 */
export async function searchFiles(
  take: number,
  skip: number,
  filter: string,
  sortBy: string,
  descending = false,
  expires?: number
): Promise<CountQuery<FileEntity>> {
  const { data } = await executeQuery<CountQuery<FileEntity>>(SEARCH_FILES, {
    skip,
    take,
    filter,
    sortBy,
    descending,
    expires,
  });
  return data;
}

/**
 * Searches for users files
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param filter - search term for filename
 * @param sortBy - column name to sort by
 * @param descending - sort ascending or descending
 * @param expires - number of seconds in which the file link shall expire
 * @returns search output object
 */
export async function searchMyFiles(
  take: number,
  skip: number,
  filter: string,
  sortBy: string,
  descending = false,
  expires?: number
): Promise<CountQuery<FileEntity>> {
  const { data } = await executeQuery<CountQuery<FileEntity>>(SEARCH_MY_FILES, {
    skip,
    take,
    filter,
    sortBy,
    descending,
    expires,
  });
  return data;
}

/**
 * Searches for public files
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param filter - search term for filename
 * @param sortBy - column name to sort by
 * @param descending - sort ascending or descending
 * @param expires - number of seconds in which the file link shall expire
 * @returns search output object
 */
export async function searchPublicFiles(
  take: number,
  skip: number,
  filter: string,
  sortBy: string,
  descending = false,
  expires?: number
): Promise<CountQuery<FileEntity>> {
  const { data } = await executeQuery<CountQuery<FileEntity>>(
    SEARCH_PUBLIC_FILES,
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
 * Returns folders within a given path
 *
 * @param path - path in which folders must be located
 * @returns folders
 */
export async function getFolders(path: string): Promise<FolderEntity[]> {
  const { data } = await executeQuery<FolderEntity[]>(GET_ALL_FOLDERS, {
    path,
  });
  return data;
}

/**
 * Returns folders within a given path that contain files of user
 *
 * @param path - path in which folders must be located
 * @returns folders
 */
export async function getMyFolders(path: string): Promise<FolderEntity[]> {
  const { data } = await executeQuery<FolderEntity[]>(GET_MY_FOLDERS, {
    path,
  });
  return data;
}

/**
 * Returns folders within a given path that contain only public files
 *
 * @param path - path in which folders must be located
 * @returns folders
 */
export async function getPublicFolders(path: string): Promise<FolderEntity[]> {
  const { data } = await executeQuery<FolderEntity[]>(GET_PUBLIC_FOLDERS, {
    path,
  });
  return data;
}

/**
 * Creates a new file
 *
 * @param filename - name of file
 * @param mimetype - mimetype like application/pdf
 * @param size - size of file in bytes
 * @param file - properties of file to be created
 * @param file.loggedInReadAccess - whether logged in users shall be able to read the file
 * @param file.publicReadAccess - whether everyone publicly shall be able to read the file
 * @param file.readAccess - user groups that are granted read access
 * @param file.writeAccess - user groups that are granted write access
 * @param file.path - path in which file shall be located
 * @returns created file
 */
export async function createFile(
  filename: string,
  mimetype: string,
  size: number,
  {
    loggedInReadAccess = false,
    publicReadAccess = false,
    readAccess = [],
    writeAccess = [],
    path = '/',
  }: FileInputs
): Promise<FileEntity | null> {
  const { data } = await executeMutation<FileEntity>(CREATE_FILE, {
    filename,
    mimetype,
    size,
    loggedInReadAccess,
    publicReadAccess,
    readAccess,
    writeAccess,
    path,
  });
  return data ?? null;
}

/**
 * Updates an existing file
 *
 * @param uuid - uuid of file to be updated
 * @param filename - new name of file
 * @param path - new file path
 * @returns updated file
 */
export async function updateFile(
  uuid: string,
  filename?: string,
  path?: string
): Promise<FileEntity | null> {
  const { data } = await executeMutation<FileEntity>(UPDATE_FILE, {
    uuid,
    filename,
    path,
  });
  return data ?? null;
}

/**
 * Deletes a file
 *
 * @param uuid - uuid of file to be deleted
 * @returns deleted file
 */
export async function deleteFile(uuid: string): Promise<FileEntity | null> {
  const { data } = await executeMutation<FileEntity>(DELETE_FILE, {
    uuid,
  });
  return data ?? null;
}

/**
 * Updates access groups for a file, granting/removing read/write acecss
 *
 * @param uuid - uuid of file for which access groups shall be manipulated
 * @param groupManipulation - manipulation object
 * @param groupManipulation.addReadAccess - access groups that shall be granted read access to the file
 * @param groupManipulation.removeReadAccess - access groups for which read access shall be removed
 * @param groupManipulation.addWriteAccess - access groups that shall be granted write access to the file
 * @param groupManipulation.removeWriteAccess - access groups for which write access shall be removed
 * @returns updated file
 */
export async function manipulateFileAccessUserGroups(
  uuid: string,
  {
    addReadAccess = [],
    removeReadAccess = [],
    addWriteAccess = [],
    removeWriteAccess = [],
  }: {
    addReadAccess: string[];
    removeReadAccess: string[];
    addWriteAccess: string[];
    removeWriteAccess: string[];
  }
): Promise<FileEntity | null> {
  const { data } = await executeMutation<FileEntity>(
    MANIPULATE_FILE_ACCESS_USER_GROUPS,
    {
      uuid,
      addReadAccess,
      removeReadAccess,
      addWriteAccess,
      removeWriteAccess,
    }
  );
  return data ?? null;
}
