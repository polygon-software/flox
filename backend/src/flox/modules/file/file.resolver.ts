import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  AdminOnly,
  CurrentUser,
  OptionalUser,
} from '../roles/authorization.decorator';
import User from '../auth/entities/user.entity';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import AbstractSearchAccessControlResolver from '../abstracts/search-access-control/abstract-search-access-control.resolver';
import DeleteInput from '../abstracts/crud/inputs/delete.input';

import GetAllFilesArgs from './dto/args/get-all-files.args';
import GetFileArgs from './dto/args/get-file.args';
import GetMultipleFilesArgs from './dto/args/get-multiple-files.args';
import SearchFilesArgs from './dto/args/search-files.args';
import CreateFileInput from './dto/input/create-file.input';
import UpdateFileInput from './dto/input/update-file.input';
import S3File from './entities/file.entity';
import FileService from './file.service';
import FileSearchOutput from './dto/outputs/file-search.output';

@Resolver(() => S3File)
export default class FileResolver extends AbstractSearchAccessControlResolver<
  S3File,
  FileService
> {
  constructor(private readonly fileService: FileService) {
    super('filename');
  }

  get service(): FileService {
    return this.fileService;
  }

  @Public()
  @Query(() => S3File, { name: 'File' })
  async getFile(
    @Args() getFileArgs: GetFileArgs,
    @OptionalUser() user?: User,
  ): Promise<S3File> {
    const file = await super.getOne(getFileArgs, user);
    return this.fileService.addFileUrl(file, getFileArgs);
  }

  @Public()
  @Query(() => [S3File], { name: 'Files' })
  async getFiles(
    @Args() getMultipleFilesArgs: GetMultipleFilesArgs,
    @OptionalUser() user?: User,
  ): Promise<S3File[]> {
    const files = await super.getMultiple(getMultipleFilesArgs, user);
    return this.fileService.addFileUrls(files, getMultipleFilesArgs);
  }

  @LoggedIn()
  @Query(() => [S3File], { name: 'MyFiles' })
  async getMyFiles(
    @Args() getMultipleFilesArgs: GetMultipleFilesArgs,
    @CurrentUser() user: User,
  ): Promise<S3File[]> {
    const files = await super.getMultipleOfMine(getMultipleFilesArgs, user);
    return this.fileService.addFileUrls(files, getMultipleFilesArgs);
  }

  @LoggedIn()
  @Query(() => [S3File], { name: 'PublicFiles' })
  async getPublicFiles(
    @Args() getMultipleFilesArgs: GetMultipleFilesArgs,
  ): Promise<S3File[]> {
    const files = await super.getMultiplePublic(getMultipleFilesArgs);
    return this.fileService.addFileUrls(files, getMultipleFilesArgs);
  }

  @LoggedIn()
  @Query(() => [S3File], { name: 'AllFiles' })
  async getAllFiles(
    @Args() getAllFilesArgs: GetAllFilesArgs,
    @OptionalUser() user?: User,
  ): Promise<S3File[]> {
    const files = await super.getAll(getAllFilesArgs, user);
    return this.fileService.addFileUrls(files, getAllFilesArgs);
  }

  /**
   * Returns private files of logged-in user
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
    const files = await super.getAllOfMine(getAllFilesArgs, user);
    return this.fileService.addFileUrls(files, getAllFilesArgs);
  }

  /**
   * Returns all public files stored within database
   * @param getAllFilesArgs - contains take and skip parameters
   * @returns List of public files
   */
  @AdminOnly()
  @Query(() => [S3File], { name: 'AllPublicFiles' })
  async getAllPublicFiles(
    @Args() getAllFilesArgs: GetAllFilesArgs,
  ): Promise<S3File[]> {
    const files = await super.getAllPublic(getAllFilesArgs);
    return this.fileService.addFileUrls(files, getAllFilesArgs);
  }

  @Public()
  @Query(() => [FileSearchOutput], { name: 'SearchFiles' })
  async searchFiles(
    @Args() searchFilesArgs: SearchFilesArgs,
    @OptionalUser() user?: User,
  ): Promise<FileSearchOutput> {
    const searchOutput = await super.search(searchFilesArgs, user);
    const data = await this.fileService.addFileUrls(
      searchOutput.data,
      searchFilesArgs,
    );
    return {
      ...searchOutput,
      data,
    };
  }

  @Public()
  @Query(() => [FileSearchOutput], { name: 'SearchPublicFiles' })
  async searchPublicFiles(
    @Args() searchFilesArgs: SearchFilesArgs,
  ): Promise<FileSearchOutput> {
    const searchOutput = await super.searchPublic(searchFilesArgs);
    const data = await this.fileService.addFileUrls(
      searchOutput.data,
      searchFilesArgs,
    );
    return {
      ...searchOutput,
      data,
    };
  }

  @LoggedIn()
  @Query(() => [FileSearchOutput], { name: 'SearchMyFiles' })
  async searchMyFiles(
    @Args() searchFilesArgs: SearchFilesArgs,
    @CurrentUser() user: User,
  ): Promise<FileSearchOutput> {
    const searchOutput = await super.searchOfUser(searchFilesArgs, user);
    const data = await this.fileService.addFileUrls(
      searchOutput.data,
      searchFilesArgs,
    );
    return {
      ...searchOutput,
      data,
    };
  }

  @AdminOnly()
  @Query(() => [FileSearchOutput], { name: 'SearchAdminFiles' })
  async searchFilesAsAdmin(
    @Args() searchFilesArgs: SearchFilesArgs,
  ): Promise<FileSearchOutput> {
    const searchOutput = await super.searchAsAdmin(searchFilesArgs);
    const data = await this.fileService.addFileUrls(
      searchOutput.data,
      searchFilesArgs,
    );
    return {
      ...searchOutput,
      data,
    };
  }

  /**
   * Creates a new file and returns a presigned url
   * @param createFileInput - new file specifications
   * @param user - logged-in user
   * @returns updated file
   */
  @LoggedIn()
  @Mutation(() => S3File, { name: 'CreateFile' })
  async createFile(
    @Args('createFileInput') createFileInput: CreateFileInput,
    @CurrentUser() user: User,
  ): Promise<S3File> {
    const file = await super.create(createFileInput, user);
    const signedUrl = await this.fileService.createSignedUploadUrl(file);
    return {
      ...file,
      signedUrl,
    } as S3File;
  }

  /**
   * Updates a file
   * @param updateFileInput - new file content
   * @param user - logged-in user
   * @returns updated file
   */
  @LoggedIn()
  @Mutation(() => S3File, { name: 'UpdateFile' })
  async updateFile(
    @Args('updateFileInput') updateFileInput: UpdateFileInput,
    @CurrentUser() user: User,
  ): Promise<S3File> {
    const file = await super.update(updateFileInput, user);
    return this.fileService.addFileUrl(file, updateFileInput);
  }

  /**
   * Deletes a file
   * @param deleteInput - contains UUID of file
   * @param user - logged-in user
   * @returns the file that was deleted
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
}
