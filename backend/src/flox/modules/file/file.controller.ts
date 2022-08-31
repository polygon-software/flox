import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import { LoggedIn, Public } from '../auth/authentication.decorator';
import { Response, Request } from 'express';

@Controller()
export class FileController {
  constructor(private readonly taskService: FileService) {}

  @Public()
  @Post('/uploadPublicFile')
  async uploadPublicFile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    // Verify that request is multipart
    if (!req.file) {
      res.send(new BadRequestException('File expected on this endpoint'));
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const file = await req.file();
    const fileBuffer = await file.toBuffer();
    const newFile = await this.taskService.uploadPublicFile(
      fileBuffer,
      file.filename,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
    const newFile = await this.taskService.uploadPrivateFile(
      fileBuffer,
      file.filename,
      owner,
    );
    res.send(newFile);
  }
}
