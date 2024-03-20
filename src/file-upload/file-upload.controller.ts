import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from './multer-config';
import { FilesService } from './files.service';
import { Request } from 'express';

@Controller('media')
export class FileUploadController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.filesService.uploadFile(file, request);
  }
}
