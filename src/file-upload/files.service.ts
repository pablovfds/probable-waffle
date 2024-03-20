import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  async uploadFile(file: Express.Multer.File, req: Request) {
    const newFile = new File();
    newFile.filename = file.filename;
    newFile.url = `${req.protocol}://${req.get('host')}/media/${file.filename}`;
    newFile.mimetype = file.mimetype;
    return newFile;
  }
}
