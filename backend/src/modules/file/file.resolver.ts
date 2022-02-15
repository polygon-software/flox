import { Args, Resolver, Query } from '@nestjs/graphql';
import PublicFile from './entities/public_file.entity';
import { FileService } from './file.service';
import { AdminOnly } from '../../auth/authorization.decorator';
import { GetPublicFileArgs } from './dto/get-public-file.args';
import { GetPrivateFileArgs } from './dto/get-private-file.args';
import PrivateFile from './entities/private_file.entity';
import { Public } from '../../auth/authentication.decorator';

@Resolver(() => PublicFile)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Query(() => PublicFile, { name: 'getPublicFile' })
  async getPublicFile(
    @Args() getPublicFileArgs: GetPublicFileArgs,
  ): Promise<PublicFile> {
    return this.fileService.getPublicFile(getPublicFileArgs);
  }

  @AdminOnly()
  @Query(() => PrivateFile, { name: 'getPrivateFile' })
  async getPrivateFile(
    @Args() getPrivateFileArgs: GetPrivateFileArgs,
  ): Promise<PrivateFile> {
    return this.fileService.getPrivateFile(getPrivateFileArgs);
  }
}
