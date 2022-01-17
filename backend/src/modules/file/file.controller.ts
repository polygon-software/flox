import {
  BadRequestException,
  Controller,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import fastify = require('fastify');
import { Public } from '../../auth/authentication.decorator';
import { AnyRole } from '../../auth/authorization.decorator';
import { ERRORS } from '../../error/ERRORS';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Controller()
export class FileController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileService: FileService,
  ) {}

  @Public()
  @Post('/uploadPublicFile')
  async uploadPublicFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }
    const file = await req.file();
    const fileBuffer = await file.toBuffer();
    const params = req.query as Record<string, string>;
    const productId = params.productId;

    const newFile = await this.fileService.uploadPublicFile(
      fileBuffer,
      file.filename,
      productId,
    );
    res.send(newFile);
  }

  @Post('/uploadPrivateFile')
  @AnyRole()
  async uploadPrivateFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException(ERRORS.file_expected));
      return;
    }

    // Get user, as determined by JWT Strategy
    const owner = req['user'].userId;

    const file = await req.file();
    const fileBuffer = await file.toBuffer();
    const newFile = await this.fileService.uploadPrivateFile(
      fileBuffer,
      file.filename,
      owner,
      {},
    );
    res.send(newFile);
  }

  @Post('/uploadUserIDFiles')
  @Public()
  async uploadUserIDFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
    @Query() query: Record<string, string>, // Params
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException(ERRORS.file_expected));
      return;
    }

    // Determine user UUID from query param
    const userUuid: string = query.uid;

    if (!userUuid) {
      throw new Error(ERRORS.no_user_found);
    }

    const user = await this.userRepository.findOne(userUuid);

    // Throw error if user doesn't exist
    if (!user) {
      throw new Error(ERRORS.no_user_found);
    }

    const files = await req.saveRequestFiles();

    let updatedUser;

    for (const file of files) {
      updatedUser = await this.fileService.uploadAssociatedFile(
        file,
        userUuid,
        'userRepository',
        { onFile: 'user', onAssociation: 'documents' },
        userUuid,
      );
    }
    res.header('access-control-allow-origin', '*');
    res.send(updatedUser);
  }
}
