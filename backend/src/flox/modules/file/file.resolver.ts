import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import PublicFile from './entities/public_file.entity';
import { FileService } from './file.service';
import { GetPublicFileArgs } from './dto/args/get-public-file.args';
import { GetPrivateFileArgs } from './dto/args/get-private-file.args';
import PrivateFile from './entities/private_file.entity';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateUserInput } from '../auth/dto/input/create-user.input';
import { DeletePrivateFileInput } from './dto/input/delete-private-file.input';

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
   * @param {DeletePrivateFileInput} deletePrivateFileInput - contains UUID
   * @returns {Promise<PrivateFile>} - the file that was deleted
   */
  @LoggedIn() // TODO application specific: set appropriate guards here
  @Mutation(() => User)
  async deletePrivateFile(
    @Args('deletePrivateFileInput')
    deletePrivateFileInput: DeletePrivateFileInput,
  ): Promise<PrivateFile> {
    return this.fileService.deletePrivateFile(deletePrivateFileInput);
  }
}
