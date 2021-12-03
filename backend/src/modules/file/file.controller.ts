import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import fastify = require('fastify');
import { Public } from '../../auth/authentication.decorator';
import { AnyRole } from '../../auth/authorization.decorator';

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
    const file_buffer = await file.toBuffer();
    const params = req.query as Record<string, string>;
    const productId = params.productId;

    const new_file = await this.fileService.uploadPublicFile(
      file_buffer,
      file.filename,
      productId,
    );
    res.send(new_file);
  }

  @Post('/uploadPrivateFile')
  @AnyRole()
  async uploadPrivateFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }

    // Get user, as determined by JWT Strategy
    const owner = req['user'].userId;

    const file = await req.file();
    const file_buffer = await file.toBuffer();
    const new_file = await this.fileService.uploadPrivateFile(
      file_buffer,
      file.filename,
      owner,
    );
    res.send(new_file);
  }
}
