import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly repo: ProjectsRepository) {}

  create(orgId: number, dto: CreateProjectDto) {
    dto.org_id = orgId;
    return this.repo.create(dto);
  }

  async findAll(orgId: number, query: PaginationQueryDto) {

    const { pageIndex = 1, pageSize = 10 } = query;

    const offset = (pageIndex - 1) * pageSize;

    const [items, [{ count }]] = await Promise.all([
      this.repo.findAll(orgId, offset, pageSize),
      this.repo.countAll(orgId),
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

  async findById(orgId: number, id: number) {
    const org = await this.repo.findById(orgId, id);
    if (!org) throw new NotFoundException('Project not found');
    return org;
  }

  async update(orgId: number, id: number, dto: UpdateProjectDto) {
    return this.repo.update(orgId, id, dto);
  }

  async delete(orgId: number, id: number) {
    return this.repo.delete(orgId, id);
  }
}
