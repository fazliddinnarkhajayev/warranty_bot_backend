import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly repo: OrganizationsRepository) { }

  async create(dto: CreateOrganizationDto) {
    return this.repo.create(dto);
  }

  async findAll(query: PaginationQueryDto) {

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

  async findById(id: number) {
    const org = await this.repo.findById(id);
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: number, dto: UpdateOrganizationDto) {
    return this.repo.update(id, dto);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
