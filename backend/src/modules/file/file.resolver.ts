import { Args, Resolver, Query } from '@nestjs/graphql';
import PublicFile from './entities/public_file.entity';
import { FileService } from './file.service';
import { AnyRole, CurrentUser } from '../../auth/authorization.decorator';
import { GetPublicFileArgs } from './dto/get-public-file.args';
import { GetPrivateFileArgs } from './dto/get-private-file.args';
import PrivateFile from './entities/private_file.entity';
import { Public } from '../../auth/authentication.decorator';
import { UserService } from '../user/user.service';

@Resolver(() => PublicFile)
export class FileResolver {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}

  /**
   * Gets a public file
   * @param {GetPublicFileArgs} getPublicFileArgs - search arguments, containing UUID
   * @returns {Promise<PublicFile>} - PublicFile
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
   * @param {GetPrivateFileArgs} getPrivateFileArgs - search arguments, containing UUID
   * @param {Record<string, string>} user - the current request's user
   * @returns {Promise<PrivateFile>} - PrivateFile
   */
  @AnyRole()
  @Query(() => PrivateFile, { name: 'getPrivateFile' })
  async getPrivateFile(
    @Args() getPrivateFileArgs: GetPrivateFileArgs,
    @CurrentUser() user: Record<string, string>,
  ): Promise<PrivateFile> {
    const dbUser = await this.userService.getUser({ uuid: user.userId });
    return this.fileService.getPrivateFile(getPrivateFileArgs, dbUser);
  }
}
