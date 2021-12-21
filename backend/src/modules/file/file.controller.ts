import {
  BadRequestException,
  Controller,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Public } from '../../auth/authentication.decorator';
import { AnyRole } from '../../auth/authorization.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { Repository } from 'typeorm';
import { CREATION_STATE } from '../../ENUM/ENUMS';
import fastify = require('fastify');
import { ERRORS } from '../../error/ERRORS';

@Controller()
export class FileController {
  constructor(
    private readonly fileService: FileService,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  @Public()
  @Post('/uploadPublicFile')
  async uploadPublicFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException(ERRORS.file_expected));
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
      res.send(new BadRequestException(ERRORS.file_expected));
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
    @Query() query: Record<string, string>, // Params
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException(ERRORS.file_expected));
      return;
    }

    // Determine company UUID from query param
    const companyId: string = query.cid; // Base64 encoded ID from params
    const companyUuid: string | null = Buffer.from(
      companyId,
      'base64',
    ).toString();

    // TODO: Don't forget to change file owner once company has a cognito ID!

    const company = await this.companyRepository.findOne(companyUuid);

    // Throw error if invalid company or document upload not enabled
    if (
      !company ||
      (company.creation_state !== CREATION_STATE.AWAITING_DOCUMENTS &&
        company.creation_state !== CREATION_STATE.DOCUMENTS_UPLOADED)
    ) {
      throw new Error(ERRORS.no_valid_company);
    }

    const file = await req.file();

    if (!file) {
      throw new Error(ERRORS.no_valid_file);
    }
    const file_buffer = await file.toBuffer();
    const new_file = await this.fileService.uploadPrivateFile(
      file_buffer,
      file.filename,
      companyUuid, // Owner; must be changed to cognito ID later
      company,
    );
    company.creation_state = CREATION_STATE.DOCUMENTS_UPLOADED;
    await this.companyRepository.save(company);

    res.send(new_file);
  }
}
