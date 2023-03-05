import { IsAlphanumeric, IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusQuery } from 'src/utils/enums/query.enum';
import { BaseQueryDto } from './base-query.dto';

export class BatchQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsAlphanumeric()
  keyword: string;
}

export class KeywordQueryDto extends BatchQueryDto {
  @IsOptional()
  @IsString()
  batchId: string;

  @IsOptional()
  @IsEnum(StatusQuery)
  status: StatusQuery;
}