import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import fastify = require('fastify');
import { Public } from '../auth/auth.guard';

@Controller()
export class FileController {
  constructor(private readonly taskService: FileService) {}

  @Public()
  @Post('/uploadFile')
  async uploadFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    //Check request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }
    const file = await req.file();
    const file_buffer = await file.toBuffer();
    const new_file = await this.taskService.uploadPublicFile(
      file_buffer,
      file.filename,
    );
    res.send(new_file);
  }
}
