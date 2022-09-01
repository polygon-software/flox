import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import PublicFile from './entities/public_file.entity';
import { FileService } from './file.service';
import { GetPublicFileArgs } from './dto/args/get-public-file.args';
import { GetPrivateFileArgs } from './dto/args/get-private-file.args';
import PrivateFile from './entities/private_file.entity';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import { User } from '../auth/entities/user.entity';
import { DeleteFileInput } from './dto/input/delete-file.input';

@Resolver(() => PublicFile)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  /**
   * Gets a public file
   * @param {GetPublicFileArgs} getPublicFileArgs - contains UUID
   * @returns {Promise<PublicFile>} - the file
   */
  @Public()
  @Query(() => PublicFile, { name: 'getPublicFile' })
  async getPublicFile(
    @Args() getPublicFileArgs: GetPublicFileArgs,
  ): Promise<PublicFile> {
    return this.fileService.getPublicFile(getPublicFileArgs);
  }

  /**
   * Gets a private file
   * @param {GetPrivateFileArgs} getPrivateFileArgs - contains UUID and optionally, expiration time
   * @returns {Promise<PrivateFile>} - the file, if the user is allowed to access it
   */
  @LoggedIn() // TODO application specific: set appropriate guards here
  @Query(() => PrivateFile, { name: 'getPrivateFile' })
  async getPrivateFile(
    @Args() getPrivateFileArgs: GetPrivateFileArgs,
  ): Promise<PrivateFile> {
    return this.fileService.getPrivateFile(getPrivateFileArgs);
  }

  /**
   * Deletes a private file
   * @param {DeleteFileInput} deleteFileInput - contains UUID
   * @returns {Promise<PrivateFile>} - the file that was deleted
   */
  @LoggedIn() // TODO application specific: set appropriate guards here
  @Mutation(() => User)
  async deletePrivateFile(
    @Args('deleteFileInput')
    deleteFileInput: DeleteFileInput,
  ): Promise<PrivateFile> {
    // TODO application specific: Ensure only allowed person (usually admin or file owner) is allowed to delete
    return this.fileService.deleteFile(
      deleteFileInput,
      false,
    ) as unknown as PrivateFile;
  }

  /**
   * Deletes a public file
   * @param {DeleteFileInput} deleteFileInput - contains UUID
   * @returns {Promise<PrivateFile>} - the file that was deleted
   */
  @LoggedIn() // TODO application specific: set appropriate guards here
  @Mutation(() => User)
  async deletePublicFile(
    @Args('deleteFileInput')
    deleteFileInput: DeleteFileInput,
  ): Promise<PublicFile> {
    // TODO application specific: Ensure only allowed person (usually admin ) is allowed to delete
    return this.fileService.deleteFile(
      deleteFileInput,
      true,
    ) as unknown as PublicFile;
  }
}
