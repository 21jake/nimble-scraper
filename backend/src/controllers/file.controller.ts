import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Request,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { appEnv } from 'src/configs/config';
import { BatchQueryDto, KeywordQueryDto } from 'src/dto/file-query.dto';
import { Keyword } from 'src/entities/keyword.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { FileService } from 'src/services/file.service';
import { csvMulterOptions } from 'src/utils/helpers';

@Controller('/api/file')
@UseInterceptors(new RequestInterceptor())
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', csvMulterOptions))
  async uploadFile(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'csv' }),
          new MaxFileSizeValidator({ maxSize: appEnv.MAX_FILE_SIZE_BYTE }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.fileService.handleFileUpload(file, req.user);
  }

  @Get('/batches')
  @UseGuards(JwtAuthGuard)
  async getBatches(@Request() req, @Query() params: BatchQueryDto) {
    return await this.fileService.getBatches(req.user, params);
  }

  @Get('/keywords')
  @UseGuards(JwtAuthGuard)
  async getKeywords(@Request() req, @Query() params: KeywordQueryDto) {
    return await this.fileService.getKeywords(req.user, params);
  }

  @Sse('/:batchId')
  @UseGuards(JwtAuthGuard)
  async streamBatchDetail(@Param('batchId') batchId: string, @Request() req): Promise<Observable<IObservableData<Keyword[]>>> {
    return await this.fileService.streamBatchDetail(batchId, req.user);
  }
}
interface IObservableData<T> {
  data: T;
}
