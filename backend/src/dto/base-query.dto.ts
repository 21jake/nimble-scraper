import { IsOptional, IsString } from 'class-validator';

export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BaseQueryDto {
  @IsOptional()
  page: number;

  @IsOptional()
  size: number;

  @IsOptional()
  sort: any;

  @IsOptional()
  order: SortType;
}
