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

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

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

  @Post('/uploadUserIDFile')
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

    // Determine dossier UUID from query param
    const dossierUuid: string = query.did;
    const files = await req.saveRequestFiles();
    let updatedDossier;
    for (const file of files) {
      updatedDossier = await this.fileService.uploadAssociatedFile(
        file,
        dossierUuid,
        'dossierRepository',
        { onFile: 'dossier', onAssociation: 'documents' },
        req['user'].userId,
      );
    }
    res.header('access-control-allow-origin', '*');
    res.send(updatedDossier);
  }
}
