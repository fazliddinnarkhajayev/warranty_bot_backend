import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  pageIndex?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  pageSize?: number = 10;
}
