import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import fastify = require('fastify');
import { Public } from '../auth/authentication.decorator';
import { JwtAuthGuard } from '../auth/auth.guard';

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

  @Public() // TODO Application specific: Ensure an owner is assigned to private file, possibly restrict
  @Post('/uploadPrivateFile')
  async uploadPrivateFile(
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
    const new_file = await this.taskService.uploadPrivateFile(
      file_buffer,
      file.filename,
    );
    res.send(new_file);
  }
}
