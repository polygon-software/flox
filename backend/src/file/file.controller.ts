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
import { Public } from '../auth/authentication.decorator';
import { AnyRole } from '../auth/authorization.decorator';

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
    const new_file = await this.fileService.uploadPublicFile(
      file_buffer,
      file.filename,
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

  @Post('/uploadCompanyFile')
  @Public()
  async uploadCompanyFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
    @Query() query,
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }

    // Determine company UUID from query param
    const companyId = query.cid; // Base64 encoded ID from params
    const companyUuid: string | null = Buffer.from(
      companyId,
      'base64',
    ).toString();
    // TODO: mark file for later owner-change once company has a cognito ID

    console.log('Company UUID is', companyUuid, 'from ID', companyId);

    const file = await req.file();
    const file_buffer = await file.toBuffer();
    const new_file = await this.fileService.uploadPrivateFile(
      file_buffer,
      file.filename,
      companyUuid, // Owner; must be changed to cognito ID later
      companyUuid,
    );

    // TODO add to documents array

    res.send(new_file);
  }
}
