import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { LoggedIn } from '../auth/authentication.decorator';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminOnly, CurrentUser } from '../roles/authorization.decorator';
import { User } from '../auth/entities/user.entity';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @AdminOnly()
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
      return;
    }

    // Actually upload via FileService
    const newFile = await this.fileService.uploadPublicFile(file);

    res.send(newFile);
  }

  @Post('/uploadPrivateFile')
  @LoggedIn()
  @UseInterceptors(FileInterceptor('file'))
  async uploadPrivateFile(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<void> {
    // Verify that request contains file
    if (!file) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }

    // Ensure userID is given
    if (!req['user']?.userId) {
      res.send(new UnauthorizedException());
    }

    const newFile = await this.fileService.uploadPrivateFile(file, user);
    res.send(newFile);
  }
}
