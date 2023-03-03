import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'fs';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FileService } from 'src/services/file.service';
import { csvMulterOptions } from 'src/utils/helpers';

@Controller('/api/file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', csvMulterOptions))
  async uploadFile(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      }),
    )
    file: Express.Multer.File,
  ) {

    return await this.fileService.saveBatch(file, req.user);
  }
}
