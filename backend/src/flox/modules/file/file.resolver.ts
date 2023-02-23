import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Like } from 'typeorm';

import {
  AdminOnly,
  CurrentUser,
  OptionalUser,
} from '../roles/authorization.decorator';
import User from '../auth/entities/user.entity';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import AbstractSearchAccessControlResolver from '../abstracts/search-access-control/abstract-search-access-control.resolver';
import DeleteInput from '../abstracts/crud/dto/input/delete.input';
import UserGroup from '../access-control/entities/user-group.entity';
import GetOneArgs from '../abstracts/crud/dto/args/get-one.args';
import ManipulateAccessGroupsInput from '../abstracts/crud-access-control/dto/input/manipulate-access-groups.input';

import GetAllFilesArgs from './dto/args/get-all-files.args';
import GetFileArgs from './dto/args/get-file.args';
import GetMultipleFilesArgs from './dto/args/get-multiple-files.args';
import SearchFilesArgs from './dto/args/search-files.args';
import CreateFileInput from './dto/input/create-file.input';
import UpdateFileInput from './dto/input/update-file.input';
import S3File from './entities/file.entity';
import FileService from './file.service';
import FileSearchOutput from './dto/outputs/file-search.output';
import FolderOutput from './dto/output/folder.output';
import GetAllFoldersArgs from './dto/args/get-all-folders.args';

@Resolver(() => S3File)
export default class FileResolver extends AbstractSearchAccessControlResolver<
  S3File,
  FileService
> {
  constructor(private readonly fileService: FileService) {
    super(['filename', 'path']);
  }

  /**
   * @returns file service
   */
  get service(): FileService {
    return this.fileService;
  }

  /**
   * Finds all user groups with read access to a file
   *
   * @param getOneArgs - contains uuid of the file
   * @returns list of user groups with read access to the file
   */
  @AdminOnly()
  @Query(() => [UserGroup], { name: 'FileReadAccessUserGroups' })
  async getFileReadAccessUserGroups(
    @Args() getOneArgs: GetOneArgs,
  ): Promise<UserGroup[]> {
    return super.getReadAccessUserGroups(getOneArgs);
  }

  /**
   * Finds all user groups with write access to a file
   *
   * @param getOneArgs - contains uuid of file
   * @returns list of user groups with write access to the file
   */
  @AdminOnly()
  @Query(() => [UserGroup], { name: 'FileWriteAccessUserGroups' })
  async getFileWriteAccessUserGroups(
    @Args() getOneArgs: GetOneArgs,
  ): Promise<UserGroup[]> {
    return super.getWriteAccessUserGroups(getOneArgs);
  }

  /**
   * Retrieves a single file from the database. Depending on whether a user is logged in and whether
   * the user has an admin role, returns public/users/admin files only.
   *
   * @param getFileArgs - contains uuid of file to be retrieved
   * @param user - the user that retrieves the file
   * @returns the one file that was received
   */
  @Public()
  @Query(() => S3File, { name: 'File' })
  async getFile(
    @Args() getFileArgs: GetFileArgs,
    @OptionalUser() user?: User,
  ): Promise<S3File> {
    const file = await super.getOne(getFileArgs, user);
    return this.fileService.addFileUrl(file, getFileArgs);
  }

  /**
   * Retrieves multiple files explicitely specified by their uuid. Depending on whether a user is logged in and whether
   * the user has an admin role, returns public/users/admin files only.
   *
   * @param getMultipleFilesArgs - contains a list of uuids of the files to retrieve
   * @param user - the user that retrieves the files
   * @returns the list of found files
   */
  @Public()
  @Query(() => [S3File], { name: 'Files' })
  async getFiles(
    @Args() getMultipleFilesArgs: GetMultipleFilesArgs,
    @OptionalUser() user?: User,
  ): Promise<S3File[]> {
    const files = await super.getMultiple(getMultipleFilesArgs, user);
    return this.fileService.addFileUrls(files, getMultipleFilesArgs);
  }

  /**
   * Retrieves multiple files explicitely specified by their uuid. It only returns the files that the
   * user is the owner or the user is part of an access group that has read access to these files. This
   * endpoint does not return public files, though, since they do not explicitely belong to the user.
   *
   * @param getMultipleFilesArgs - contains a list of uuids of the files to retrieve
   * @param user - the user that retrieves the files
   * @returns the list of found files
   */
  @LoggedIn()
  @Query(() => [S3File], { name: 'MyFiles' })
  async getMyFiles(
    @Args() getMultipleFilesArgs: GetMultipleFilesArgs,
    @CurrentUser() user: User,
  ): Promise<S3File[]> {
    const files = await super.getMultipleOfMine(getMultipleFilesArgs, user);
    return this.fileService.addFileUrls(files, getMultipleFilesArgs);
  }

  /**
   * Retrieves multiple files explicitely specified by their uuid. It only returns the files that are marked with
   * public read access.
   *
   * @param getMultipleFilesArgs - contains a list of uuids of the files to retrieve
   * @returns the list of found files
   */
  @LoggedIn()
  @Query(() => [S3File], { name: 'PublicFiles' })
  async getPublicFiles(
    @Args() getMultipleFilesArgs: GetMultipleFilesArgs,
  ): Promise<S3File[]> {
    const files = await super.getMultiplePublic(getMultipleFilesArgs);
    return this.fileService.addFileUrls(files, getMultipleFilesArgs);
  }

  /**
   * Retrieves all files from a database with applying pagination. Depending on whether a user is logged in and whether
   * the user has an admin role, returns public/users/admin files only.
   *
   * @param getAllFilesArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the entity
   * @returns page of files
   */
  @LoggedIn()
  @Query(() => [S3File], { name: 'AllFiles' })
  async getAllFiles(
    @Args() getAllFilesArgs: GetAllFilesArgs,
    @OptionalUser() user?: User,
  ): Promise<S3File[]> {
    const options = getAllFilesArgs.path
      ? {
          where: {
            path: getAllFilesArgs.path,
          },
        }
      : {};
    return super.getAll(getAllFilesArgs, user, options);
  }

  /**
   * Retrieves all folders from a given base path based on the files that are located within the provided path.
   * Depending on whether a user is logged in and whether the user has an admin role,
   * returns public/users/admin folders only.
   *
   * @param getAllFoldersArgs - contains base path
   * @param user - the user that retrieves the entity
   * @returns page of folders
   */
  @LoggedIn()
  @Query(() => [FolderOutput], { name: 'Folders' })
  async getAllFolders(
    @Args() getAllFoldersArgs: GetAllFoldersArgs,
    @OptionalUser() user?: User,
  ): Promise<FolderOutput[]> {
    const { path } = getAllFoldersArgs;
    const searchPath = path !== '/' ? `${path}/` : path;
    const options = getAllFoldersArgs.path
      ? {
          where: {
            path: Like(`${searchPath}%`),
          },
        }
      : {};
    const files = await super.getAll({ take: 5000, skip: 0 }, user, options);
    return this.fileService.filesToFolders(files, searchPath);
  }

  /**
   * Returns private files of logged-in user
   *
   * @param getAllFilesArgs - contains take and skip parameters
   * @param user - currently logged-in user
   * @returns Users private files
   */
  @LoggedIn()
  @Query(() => [S3File], { name: 'AllMyFiles' })
  async getAllMyFiles(
    @Args() getAllFilesArgs: GetAllFilesArgs,
    @CurrentUser() user: User,
  ): Promise<S3File[]> {
    const options = getAllFilesArgs.path
      ? {
          where: {
            path: getAllFilesArgs.path,
          },
        }
      : {};
    return super.getAllOfMine(getAllFilesArgs, user, options);
  }

  /**
   * Retrieves all folders from a given base path based on the files that are located within the provided path.
   * It only returns the folders that the user is the owner or the user is part of an access group
   * that has read access to these files. This endpoint does not return public files, though,
   * since they do not explicitely belong to the user.
   *
   * @param getAllFoldersArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the entity
   * @returns page of folders
   */
  @LoggedIn()
  @Query(() => [FolderOutput], { name: 'MyFolders' })
  async getMyAllFolders(
    @Args() getAllFoldersArgs: GetAllFoldersArgs,
    @CurrentUser() user: User,
  ): Promise<FolderOutput[]> {
    const { path } = getAllFoldersArgs;
    const searchPath = path !== '/' ? `${path}/` : path;
    const options = getAllFoldersArgs.path
      ? {
          where: {
            path: Like(`%${searchPath}`),
          },
        }
      : {};
    const files = await super.getAllOfMine(
      { take: 5000, skip: 0 },
      user,
      options,
    );
    return this.fileService.filesToFolders(files, searchPath);
  }

  /**
   * Retrieves all files from a database with applying pagination. It only returns the files that are marked with
   * public read access.
   *
   * @param getAllFilesArgs - contains pagination parameters (skip, take)
   * @returns page of files
   */
  @AdminOnly()
  @Query(() => [S3File], { name: 'AllPublicFiles' })
  async getAllPublicFiles(
    @Args() getAllFilesArgs: GetAllFilesArgs,
  ): Promise<S3File[]> {
    const options = getAllFilesArgs.path
      ? {
          where: {
            path: getAllFilesArgs.path,
          },
        }
      : {};
    return super.getAllPublic(getAllFilesArgs, options);
  }

  /**
   * Retrieves all folders from a given base path based on the files that are located within the provided path.
   * It only returns the folders that are marked with  public read access.
   *
   * @param getAllFoldersArgs - contains pagination parameters (skip, take)
   * @returns page of folders
   */
  @AdminOnly()
  @Query(() => [FolderOutput], { name: 'PublicFolders' })
  async getAllPublicFolders(
    @Args() getAllFoldersArgs: GetAllFoldersArgs,
  ): Promise<FolderOutput[]> {
    const { path } = getAllFoldersArgs;
    const searchPath = path !== '/' ? `${path}/` : path;
    const options = getAllFoldersArgs.path
      ? {
          where: {
            path: Like(`%${searchPath}`),
          },
        }
      : {};
    const files = await super.getAllPublic({ take: 5000, skip: 0 }, options);
    return this.fileService.filesToFolders(files, searchPath);
  }

  /**
   * Queries for all files that fit query criteria. Depending on whether a user is logged in and whether
   * the user has an admin role, returns public/users/admin files only.
   *
   * @param searchFilesArgs - contain table filtering rules
   * @param user - user that retrieves entities
   * @returns files that fit criteria
   */
  @Public()
  @Query(() => FileSearchOutput, { name: 'SearchFiles' })
  async searchFiles(
    @Args() searchFilesArgs: SearchFilesArgs,
    @OptionalUser() user?: User,
  ): Promise<FileSearchOutput> {
    return super.search(searchFilesArgs, user);
  }

  /**
   * Queries for all files that fit query criteria. It only returns the entities that are marked with
   * public read access.
   *
   * @param searchFilesArgs - contain table filtering rules
   * @returns files that fit criteria
   */
  @Public()
  @Query(() => FileSearchOutput, { name: 'SearchPublicFiles' })
  async searchPublicFiles(
    @Args() searchFilesArgs: SearchFilesArgs,
  ): Promise<FileSearchOutput> {
    return super.searchPublic(searchFilesArgs);
  }

  /**
   * Queries for all files that fit query criteria. It only returns the files that the
   * user is the owner or the user is part of an access group that has read access to these files. This
   * endpoint does not return public files, though, since they do not explicitely belong to the user.
   *
   * @param searchFilesArgs - contain table filtering rules
   * @param user - user that retrieves entities
   * @returns files that fit criteria
   */
  @LoggedIn()
  @Query(() => FileSearchOutput, { name: 'SearchMyFiles' })
  async searchMyFiles(
    @Args() searchFilesArgs: SearchFilesArgs,
    @CurrentUser() user: User,
  ): Promise<FileSearchOutput> {
    return super.searchOfUser(searchFilesArgs, user);
  }

  /**
   * Queries for all files that fit query criteria.
   *
   * @param searchFilesArgs - contain table filtering rules
   * @returns files that fit criteria
   */
  @AdminOnly()
  @Query(() => FileSearchOutput, { name: 'SearchAdminFiles' })
  async searchFilesAsAdmin(
    @Args() searchFilesArgs: SearchFilesArgs,
  ): Promise<FileSearchOutput> {
    return super.searchAsAdmin(searchFilesArgs);
  }

  /**
   * Creates a new file based on the create input and sets the user as the items owner.
   *
   * @param createFileInput - specifications of file, must be deep partial of entity
   * @param user - the user that creates the file
   * @returns the created file
   */
  @LoggedIn()
  @Mutation(() => S3File, { name: 'CreateFile' })
  async createFile(
    @Args('createFileInput') createFileInput: CreateFileInput,
    @CurrentUser() user: User,
  ): Promise<S3File> {
    const file = await super.create(createFileInput, user);
    const signedUrl = await this.fileService.createSignedUploadUrl(file);
    const fileWithUrl = await this.fileService.addFileUrl(file, {
      expires: 360,
    });
    const updatedFile = await this.fileService.update(
      { uuid: file.uuid },
      user,
    );
    return {
      ...updatedFile,
      signedUrl,
      url: fileWithUrl.url,
    } as S3File;
  }

  /**
   * Updates an existing file within the database according to the update input with ensuring the
   * user has appropriate write access to the item.
   *
   * @param updateFileInput - specification of update, must be deep partial of file
   * @param user - the user that updates the file
   * @returns the updated file, freshly retrieved from the database
   */
  @LoggedIn()
  @Mutation(() => S3File, { name: 'UpdateFile' })
  async updateFile(
    @Args('updateFileInput') updateFileInput: UpdateFileInput,
    @CurrentUser() user: User,
  ): Promise<S3File> {
    const file = await super.update(updateFileInput, user);
    return this.fileService.addFileUrl(file, { expires: 360 });
  }

  /**
   * Removes a file from the database with ensuring the user has appropriate write access to the file.
   *
   * @param deleteInput - contains the uuid of the file to remove
   * @param user - the user that deletes the fie
   * @returns the deleted file
   */
  @LoggedIn()
  @Mutation(() => S3File, { name: 'DeleteFile' })
  async deleteFile(
    @Args('deleteInput') deleteInput: DeleteInput,
    @CurrentUser() user: User,
  ): Promise<S3File> {
    const file = await super.delete(deleteInput, user);
    return this.fileService.deleteFileFromS3(file);
  }

  /**
   * Adds/Removes user groups from the read/write access groups of a file.
   *
   * @param manipulateAccessGroups - contains the adds/removes for the read/write groups.
   * @param user - user that tries to perform the manipulation, must have write access to the file
   * @returns Updated file
   */
  @LoggedIn()
  @Mutation(() => S3File, { name: 'ManipulateFileAccessUserGroups' })
  async manipulateFileAccessUserGroups(
    @Args('manipulateAccessGroups')
    manipulateAccessGroups: ManipulateAccessGroupsInput,
    @CurrentUser() user: User,
  ): Promise<S3File> {
    return super.manipulateAccessUserGroupsAsUser(manipulateAccessGroups, user);
  }
}
