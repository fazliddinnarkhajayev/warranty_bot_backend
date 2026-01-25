import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { CreateDistrictDto } from './dto/create-district.dto';
import { DistrictsRepository } from './districts.repository';

@Injectable()
export class DistrictsService {

  constructor(private readonly repo: DistrictsRepository) { }

  async create(dto: CreateDistrictDto) {
    return this.repo.create(dto);
  }

  async getById(id: number) {
    const data = await this.repo.findById(id);
    if (!data) throw new NotFoundException('Data not found');
    return data;
  }

  async getAll(query: PaginationQueryDto) {

    const { pageIndex = 1, pageSize = 10 } = query;

    const offset = (pageIndex - 1) * pageSize;

    const [items, [{ count }]] = await Promise.all([
      this.repo.findAll(offset, pageSize),
      this.repo.countAll(),
    ]);

    return {
      data: items,
      meta: {
        pageIndex,
        pageSize,
        totalItems: Number(count),
        totalPagesCount: Math.ceil(Number(count) / pageSize),
      },
    };
  }

  async delete(id: number) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('Data not found');
    return this.repo.deleteById(id);
  }
}
