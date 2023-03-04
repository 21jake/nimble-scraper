import {
  Controller,
  FileTypeValidator, Param,
  ParseFilePipe,
  Post, Request,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { Keyword } from 'src/entities/keyword.entity';
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

  @Sse('/:batchId')
  @UseGuards(JwtAuthGuard)
  async streamBatchDetail(
    @Request() req,
    @Param('batchId') batchId: string,
  ): Promise<Observable<IObservableData<IFileEvent>>> {
    return await this.fileService.streamBatchDetail(batchId, req.user);
  }
}
interface IFileEvent {
  total: number;
  keywords: Keyword[];
}
interface IObservableData<T> {
  data: T;
}
