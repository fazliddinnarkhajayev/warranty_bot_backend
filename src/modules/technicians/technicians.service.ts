import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { TechniciansRepository } from './technicians.repository';

@Injectable()
export class TechniciansService {

  constructor(private readonly repo: TechniciansRepository) { }

  async create(dto: CreateTechnicianDto) {
    return this.repo.create(dto);
  }

  async getById(id: number) {
    const seller = await this.repo.findById(id);
    if (!seller) throw new NotFoundException('Technician not found');
    return seller;
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
    if (!exists) throw new NotFoundException('Technician not found');
    return this.repo.deleteById(id);
  }
}
