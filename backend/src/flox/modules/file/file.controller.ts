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
  ): Promise<void> {
    // Verify that request contains file
    if (!file) {
      res.send(new BadRequestException('File expected on this endpoint'));
    }

    // Actually upload via FileService
    const newFile = await this.fileService.uploadPublicFile(file);

    res.send(newFile);
  }

  @Post('/uploadPrivateFile')
  @LoggedIn()
  async uploadPrivateFile(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    // Verify that request contains file
    if (file) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }

    // Get user, as determined by JWT Strategy
    const owner = req['user'].userId;
    const newFile = await this.fileService.uploadPrivateFile(file, owner);
    res.send(newFile);
  }
}
