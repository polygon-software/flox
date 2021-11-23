import { Args, Resolver, Query } from '@nestjs/graphql';
import PublicFile from './entities/public_file.entity';
import { FileService } from './file.service';
import { Public } from '../auth/auth.guard';
import { GetFileArgs } from './dto/get-file.args';

@Resolver(() => PublicFile)
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Query(() => PublicFile, { name: 'getFile' })
  async getFile(@Args() getFileArgs: GetFileArgs): Promise<PublicFile> {
    return await this.fileService.getFile(getFileArgs);
  }
}
