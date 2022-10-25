import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import PublicFile from './entities/publicFile.entity';
import { FileService } from './file.service';
import { GetPublicFileArgs } from './dto/args/get-public-file.args';
import { GetPrivateFileArgs } from './dto/args/get-private-file.args';
import PrivateFile from './entities/privateFile.entity';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import { DeleteFileInput } from './dto/input/delete-file.input';
import { GetAllFilesArgs } from './dto/args/get-all-files.args';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import { User } from '../auth/entities/user.entity';
import { DEFAULT_ROLES } from '../roles/config';
import { ForbiddenError } from 'apollo-server-express';

@Resolver(() => PublicFile)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  /**
   * Returns all public files stored within database
   * @param getAllFilesArgs - contains take and skip parameters
   * @returns List of public files
   */
  @AdminOnly()
  @Query(() => [PublicFile], { name: 'allPublicFiles' })
  async getAllPublicFiles(
    @Args() getAllFilesArgs: GetAllFilesArgs,
  ): Promise<PublicFile[]> {
    return this.fileService.getAllPublicFiles(getAllFilesArgs);
  }

  /**
   * Returns private files of logged-in user
   * @param getAllFilesArgs - contains take and skip parameters
   * @param user - currently logged-in user
   * @returns Users private files
   */
  @LoggedIn() // TODO application specific: set appropriate guards here
  @Query(() => [PrivateFile], { name: 'allMyFiles' })
  async getAllMyFiles(
    @Args() getAllFilesArgs: GetAllFilesArgs,
    @CurrentUser() user: User,
  ): Promise<PrivateFile[]> {
    return this.fileService.getAllMyFiles(getAllFilesArgs, user);
  }

  /**
   * Gets a public file
   * @param getPublicFileArgs - contains UUID
   * @returns the file
   */
  @Public()
  @Query(() => PublicFile, { name: 'publicFile' })
  async getPublicFile(
    @Args() getPublicFileArgs: GetPublicFileArgs,
  ): Promise<PublicFile> {
    return this.fileService.getPublicFile(getPublicFileArgs);
  }

  /**
   * Gets a private file
   * @param getPrivateFileArgs - contains UUID and optionally, expiration time
   * @param user - logged-in user
   * @returns the file, if the user is allowed to access it
   */
  @LoggedIn() // TODO application specific: set appropriate guards here
  @Query(() => PrivateFile, { name: 'privateFile' })
  async getPrivateFile(
    @Args() getPrivateFileArgs: GetPrivateFileArgs,
    @CurrentUser() user: User,
  ): Promise<PrivateFile> {
    const file = await this.fileService.getPrivateFile(getPrivateFileArgs);
    if (user.role !== DEFAULT_ROLES.ADMIN || file.owner !== user.uuid) {
      throw new ForbiddenError('File does not belong to logged in user');
    }
    return file;
  }

  /**
   * Deletes a private file
   * @param deleteFileInput - contains UUID
   * @param user - logged-in user
   * @returns the file that was deleted
   */
  @LoggedIn() // TODO application specific: set appropriate guards here
  @Mutation(() => PrivateFile)
  async deletePrivateFile(
    @Args('deleteFileInput') deleteFileInput: DeleteFileInput,
    @CurrentUser() user: User,
  ): Promise<PrivateFile> {
    const file = await this.fileService.getPrivateFile({
      uuid: deleteFileInput.uuid,
    } as GetPrivateFileArgs);
    if (user.role !== DEFAULT_ROLES.ADMIN || file.owner !== user.uuid) {
      throw new ForbiddenError(
        'Cannot delete file that does not belong to user',
      );
    }
    return this.fileService.deleteFile(
      deleteFileInput,
      false,
    ) as unknown as PrivateFile;
  }

  /**
   * Deletes a public file
   * @param deleteFileInput - contains UUID
   * @returns the file that was deleted
   */
  @AdminOnly() // TODO application specific: set appropriate guards here
  @Mutation(() => PublicFile)
  async deletePublicFile(
    @Args('deleteFileInput')
    deleteFileInput: DeleteFileInput,
  ): Promise<PublicFile> {
    return this.fileService.deleteFile(
      deleteFileInput,
      true,
    ) as unknown as PublicFile;
  }
}
