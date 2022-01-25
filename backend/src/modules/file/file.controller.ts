import {
  BadRequestException,
  Controller,
  Get,
  Options,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Public } from '../../auth/authentication.decorator';
import {
  AdminOnly,
  AnyRole,
  EmployeeOnly,
} from '../../auth/authorization.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { Repository } from 'typeorm';
import { CREATION_STATE, FILE_TYPE } from '../../ENUM/ENUMS';
import fastify = require('fastify');
import { ERRORS } from '../../error/ERRORS';
import { Offer } from '../offer/entities/offer.entity';
import { Dossier } from '../dossier/entity/dossier.entity';
import { User } from '../user/entities/user.entity';
import { getValueDevelopment } from '../../value-development/value-development';

@Controller()
export class FileController {
  constructor(
    private readonly fileService: FileService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,

    @InjectRepository(Dossier)
    private readonly dossierRepository: Repository<Dossier>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const fileBuffer = await file.toBuffer();
    const newFile = await this.fileService.uploadPublicFile(
      fileBuffer,
      file.filename,
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
      FILE_TYPE.NONE as unknown as FILE_TYPE, //Is a DossierFileType by default...
      owner,
      {},
    );
    res.send(newFile);
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
    const fileBuffer = await file.toBuffer();
    const newFile = await this.fileService.uploadPrivateFile(
      fileBuffer,
      file.filename,
      FILE_TYPE.NONE as unknown as FILE_TYPE, //Is a DossierFileType by default...
      companyUuid, // Owner; must be changed to cognito ID later
      { company },
    );
    company.creation_state = CREATION_STATE.DOCUMENTS_UPLOADED;
    await this.companyRepository.save(company);

    res.send(newFile);
  }

  /**
   * Answer to preflight options request with headers that allow authorization headers in the post requests.
   * @param {fastify.FastifyReply<any>} res - the res sent back
   * @returns {Promise<any>} - done
   */
  @Options([
    '/uploadOfferFile',
    '/uploadDossierFile',
    '/uploadDossierFinalDocument',
  ]) //Todo Find better way to allow Preflight requests
  @Public()
  async corsResponse(@Res() res: fastify.FastifyReply<any>): Promise<any> {
    res.headers({
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'access-control-allow-origin': '*',
    });
    res.send();
  }

  @Post('/uploadOfferFile')
  @AnyRole()
  async uploadOfferFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
    @Query() query: Record<string, string>, // Params
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException(ERRORS.file_expected));
      return;
    }

    // Determine offer UUID from query param
    const offerUuid: string = query.oid;
    const file = await req.file();

    const updatedOffer = await this.fileService.uploadAssociatedFile(
      file,
      FILE_TYPE.NONE as unknown as FILE_TYPE, //Is a DossierFileType by default...
      offerUuid,
      'offerRepository',
      {
        onFile: 'offer',
        onAssociation: 'documents',
      },
      req['user'].userId,
    );

    res.header('access-control-allow-origin', '*');
    res.send(updatedOffer);
  }

  @Post('/uploadDossierFile')
  @EmployeeOnly()
  async uploadDossierFile(
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
      const fileType =
        FILE_TYPE[file.fieldname.substr(0, file.fieldname.length - 5)];
      updatedDossier = await this.fileService.uploadAssociatedFile(
        file,
        fileType,
        dossierUuid,
        'dossierRepository',
        { onFile: 'dossier', onAssociation: 'documents' },
        req['user'].userId,
      );
    }
    res.header('access-control-allow-origin', '*');
    res.send(updatedDossier);
  }

  @Post('/uploadDossierFinalDocument')
  @EmployeeOnly()
  async uploadDossierFinalDocument(
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
    const file = await req.file();
    const updatedDossier = await this.fileService.uploadAssociatedFile(
      file,
      FILE_TYPE.NONE as unknown as FILE_TYPE,
      dossierUuid,
      'dossierRepository',
      { onFile: 'dossier', onAssociation: 'final_document' },
      req['user'].userId,
    );

    res.header('access-control-allow-origin', '*');
    res.send(updatedDossier);
  }

  /**
   * Uploads a value development CSV file to replace the old one
   * @param {FastifyRequest} req - request
   * @param {FastifyReply} res - response
   * @returns {Promise<void>} - done
   */
  @Post('/uploadValueDevelopmentFile')
  @AdminOnly()
  async uploadValueDevelopmentFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.isMultipart()) {
      res.send(new BadRequestException(ERRORS.file_expected));
      return;
    }

    const file = await req.file();

    if (file.mimetype !== 'text/csv') {
      res.send(new BadRequestException('YOU MUST BE BANANAS')); // TODO
    }

    console.log('Upload file!');
    await this.fileService.uploadValueDevelopmentFile(file);

    res.header('access-control-allow-origin', '*');
    res.send('OK'); //TODO some response?
  }

  /**
   * Gets the value
   * @param {FastifyRequest} req - request
   * @param {FastifyReply} res - response
   * @param {Record<string, string>} query - URL query, should contain 'zipCode', 'start' and 'end'
   * @returns {Promise<void>} - done
   */
  @Get('/getValueDevelopment')
  @EmployeeOnly()
  async getValueDevelopment(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
    @Query() query: Record<string, string>, // Params
  ): Promise<any> {
    const zipCode = query.zipCode;
    const start = query.start;
    const end = query.end;

    // Ensure all attributes present
    if (!zipCode || !start || !end) {
      res.send(new Error(ERRORS.missing_query_parameters));
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Ensure dates are valid end date is after start date
    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime()) ||
      endDate.getTime() < startDate.getTime()
    ) {
      res.send(new Error(ERRORS.invalid_date_input));
      return;
    }

    try {
      // Calculate value multiplier
      const multiplier = await getValueDevelopment(zipCode, startDate, endDate);
      res.header('access-control-allow-origin', '*');
      res.send(multiplier);
    } catch (error) {
      // Return any calculation errors that occurred
      res.send(error);
    }
  }
}
