import { Args, Resolver, Query } from '@nestjs/graphql';
import PublicFile from './entities/public_file.entity';
import { FileService } from './file.service';
import { JwtAuthGuard, Public } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { GetPublicFileArgs } from './dto/get-public-file.args';
import { GetPrivateFileArgs } from './dto/get-private-file.args';
import PrivateFile from './entities/private_file.entity';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';

@Resolver(() => PublicFile)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Query(() => PublicFile, { name: 'getPublicFile' })
  async getPublicFile(
    @Args() getPublicFileArgs: GetPublicFileArgs,
  ): Promise<PublicFile> {
    return await this.fileService.getPublicFile(getPublicFileArgs);
  }

  // @Public() // TODO restrict to files owned by me
  @UseGuards(JwtAuthGuard) // Allow only logged-in users to access
  @UseGuards(RolesGuard) // Allow only role-specific access
  @Roles('admin')
  @Query(() => PrivateFile, { name: 'getPrivateFile' })
  async getPrivateFile(
    @Args() getPrivateFileArgs: GetPrivateFileArgs,
  ): Promise<PrivateFile> {
    return await this.fileService.getPrivateFile(getPrivateFileArgs);
  }
}
