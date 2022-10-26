import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { GetFileArgs } from './dto/args/get-file.args';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import { GetAllFilesArgs } from './dto/args/get-all-files.args';
import {
  AdminOnly,
  CurrentUser,
  OptionalUser,
} from '../roles/authorization.decorator';
import { User } from '../auth/entities/user.entity';
import { AbstractCrudAccessControlResolver } from '../abstracts/crud-access-control/abstract-crud-access-control.resolver';
import S3File from './entities/file.entity';
import { GetMultipleFilesArgs } from './dto/args/get-multiple-files.args';
import { UpdateFileInput } from './dto/input/update-file.input';
import { DeleteInput } from '../abstracts/crud/inputs/delete.input';

@Resolver(() => S3File)
export class FileResolver extends AbstractCrudAccessControlResolver<
  S3File,
  FileService
> {
  constructor(private readonly fileService: FileService) {
    super();
  }

  get service(): FileService {
    return this.fileService;
  }

  @Public()
  @Query(() => S3File, { name: 'file' })
  async getFile(
    @Args() getFileArgs: GetFileArgs,
    @OptionalUser() user?: User,
  ): Promise<S3File> {
    const file = await super.getOne(getFileArgs, user);
    return this.fileService.addFileUrl(file, getFileArgs);
  }

  @Public()
  @Query(() => [S3File], { name: 'files' })
  async getFiles(
    @Args() getMultipleFilesArgs: GetMultipleFilesArgs,
    @OptionalUser() user?: User,
  ): Promise<S3File[]> {
    const files = await super.getMultiple(getMultipleFilesArgs, user);
    return this.fileService.addFileUrls(files, getMultipleFilesArgs);
  }

  @LoggedIn()
  @Query(() => [S3File], { name: 'myFiles' })
  async getMyFiles(
    @Args() getMultipleFilesArgs: GetMultipleFilesArgs,
    @CurrentUser() user: User,
  ): Promise<S3File[]> {
    const files = await super.getMultipleOfMine(getMultipleFilesArgs, user);
    return this.fileService.addFileUrls(files, getMultipleFilesArgs);
  }

  @LoggedIn()
  @Query(() => [S3File], { name: 'publicFiles' })
  async getPublicFiles(
    @Args() getMultipleFilesArgs: GetMultipleFilesArgs,
  ): Promise<S3File[]> {
    const files = await super.getMultiplePublic(getMultipleFilesArgs);
    return this.fileService.addFileUrls(files, getMultipleFilesArgs);
  }

  @LoggedIn()
  @Query(() => [S3File], { name: 'allFiles' })
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
  @Query(() => [S3File], { name: 'allMyFiles' })
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
  @Query(() => [S3File], { name: 'allPublicFiles' })
  async getAllPublicFiles(
    @Args() getAllFilesArgs: GetAllFilesArgs,
  ): Promise<S3File[]> {
    const files = await super.getAllPublic(getAllFilesArgs);
    return this.fileService.addFileUrls(files, getAllFilesArgs);
  }

  /**
   * Updates a file
   * @param updateFileInput - new file content
   * @param user - logged-in user
   * @returns updated file
   */
  @LoggedIn()
  @Mutation(() => S3File)
  async updateFile(
    @Args() updateFileInput: UpdateFileInput,
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
  @Mutation(() => S3File)
  async deleteFile(
    @Args() deleteInput: DeleteInput,
    @CurrentUser() user: User,
  ): Promise<S3File> {
    const file = await super.delete(deleteInput, user);
    return this.fileService.deleteFileFromS3(file);
  }
}
