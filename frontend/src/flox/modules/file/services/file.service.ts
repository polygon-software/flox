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
import { FileEntity } from 'src/flox/modules/file/entities/file.entity';
import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';
import {
  CREATE_FILE,
  DELETE_FILE,
  MANIPULATE_FILE_ACCESS_USER_GROUPS,
  UPDATE_FILE,
} from 'src/flox/modules/file/file.mutation';
import FolderEntity from 'src/flox/modules/file/entities/folder.entity';
import UserGroupEntity from 'src/flox/modules/access-control/entities/user-group.entity';

/**
 * Fetches a private file
 * @param uuid - uuid of private file
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

export async function getFolders(path: string): Promise<FolderEntity[]> {
  const { data } = await executeQuery<FolderEntity[]>(GET_ALL_FOLDERS, {
    path,
  });
  return data;
}

export async function getMyFolders(path: string): Promise<FolderEntity[]> {
  const { data } = await executeQuery<FolderEntity[]>(GET_MY_FOLDERS, {
    path,
  });
  return data;
}

export async function getPublicFolders(path: string): Promise<FolderEntity[]> {
  const { data } = await executeQuery<FolderEntity[]>(GET_PUBLIC_FOLDERS, {
    path,
  });
  return data;
}

export type FileInputs = {
  loggedInReadAccess?: boolean;
  publicReadAccess?: boolean;
  readAccess?: string[];
  writeAccess?: string[];
  path?: string;
  expires?: number;
};

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

export async function updateFile(
  uuid: string,
  filename: string,
  path: string,
): Promise<FileEntity | null> {
  const { data } = await executeMutation<FileEntity>(UPDATE_FILE, {
    uuid,
    filename,
    path,
  });
  return data ?? null;
}

export async function deleteFile(uuid: String): Promise<FileEntity | null> {
  const { data } = await executeMutation<FileEntity>(DELETE_FILE, {
    uuid,
  });
  return data ?? null;
}

export async function manipulateFileAccessUserGroups(
  uuid: String,
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
