import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Post('/uploadPublicFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPublicFile(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    // Verify that request is multipart
    if (!file) {
      res.send(new BadRequestException('File expected on this endpoint'));
    }

    const fileBuffer = await file.buffer;
    const newFile = await this.fileService.uploadPublicFile(
      fileBuffer,
      file.filename,
    );

    res.send(newFile);
  }

  @Post('/uploadPrivateFile')
  @LoggedIn()
  async uploadPrivateFile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.file) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }

    // Get user, as determined by JWT Strategy
    const owner = req['user'].userId;
    const file = req.file;
    const fileBuffer = file.buffer;
    const newFile = await this.fileService.uploadPrivateFile(
      fileBuffer,
      file.filename,
      owner,
    );
    res.send(newFile);
  }
}
