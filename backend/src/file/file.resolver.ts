import { Args, Resolver, Query } from '@nestjs/graphql';
import PublicFile from './entities/public_file.entity';
import { FileService } from './file.service';
import { Public } from '../auth/auth.guard';
import { GetPublicFileArgs } from './dto/get-public-file.args';

@Resolver(() => PublicFile)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Query(() => PublicFile, { name: 'getPublicFile' })
  async getPublicFile(@Args() getFileArgs: GetPublicFileArgs): Promise<PublicFile> {
    return await this.fileService.getPublicFile(getFileArgs);
  }
}
