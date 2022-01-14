import { Args, Resolver, Query } from '@nestjs/graphql';
import PublicFile from './entities/public_file.entity';
import { FileService } from './file.service';
import { AnyRole, CurrentUser } from '../../auth/authorization.decorator';
import { GetPublicFileArgs } from './dto/get-public-file.args';
import { GetPrivateFileArgs } from './dto/get-private-file.args';
import PrivateFile from './entities/private_file.entity';
import { Public } from '../../auth/authentication.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Resolver(() => PublicFile)
export class FileResolver {
  constructor(
    private readonly fileService: FileService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Public()
  @Query(() => PublicFile, { name: 'getPublicFile' })
  async getPublicFile(
    @Args() getPublicFileArgs: GetPublicFileArgs,
  ): Promise<PublicFile> {
    return this.fileService.getPublicFile(getPublicFileArgs);
  }

  @AnyRole()
  @Query(() => PrivateFile, { name: 'getPrivateFile' })
  async getPrivateFile(
    @Args() getPrivateFileArgs: GetPrivateFileArgs,
    @CurrentUser() user: Record<string, string>,
  ): Promise<PrivateFile> {
    // Get DB user
    const dbUser = await this.userRepository.findOne({
      uuid: user.sub,
    });

    return this.fileService.getPrivateFile(getPrivateFileArgs, dbUser);
  }
}
