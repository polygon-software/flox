import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import fastify = require('fastify');
import { LoggedIn, Public } from '../auth/authentication.decorator';

@Controller()
export class FileController {
  constructor(private readonly taskService: FileService) {}

  @Public()
  @Post('/uploadPublicFile')
  async uploadPublicFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    // Verify that request is multipart
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!req.isMultipart()) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const file = await req.file();
    const file_buffer = await file.toBuffer();
    const new_file = await this.taskService.uploadPublicFile(
      file_buffer,
      file.filename,
    );
    res.send(new_file);
  }

  @Post('/uploadPrivateFile')
  @LoggedIn()
  async uploadPrivateFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    // Verify that request is multipart
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!req.isMultipart()) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }

    // Get user, as determined by JWT Strategy
    const owner = req['user'].userId;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const file = await req.file();
    const file_buffer = await file.toBuffer();
    const new_file = await this.taskService.uploadPrivateFile(
      file_buffer,
      file.filename,
      owner,
    );
    res.send(new_file);
  }
}
