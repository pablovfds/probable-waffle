import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FilesService } from './files.service';
@Module({
  imports: [],
  controllers: [FileUploadController],
  providers: [FilesService],
  exports: [],
})
export class FileUploadModule {}
