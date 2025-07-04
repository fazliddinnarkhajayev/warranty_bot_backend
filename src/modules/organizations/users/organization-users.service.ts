import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationUserDto } from './dto/create-organization-user.dto';
import { UpdateOrganizationUserDto } from './dto/update-organization-user.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { OrganizationUsersRepository } from './organization-users.repository';
import { UsersRepository } from 'src/modules/users/users.repository';

@Injectable()
export class OrganizationUsersService {
  constructor(
    private readonly repo: OrganizationUsersRepository,
    private readonly usersRepo: UsersRepository
  ) { }

  async create(orgId: number, dto: CreateOrganizationUserDto) {
    return this.repo.create(orgId, dto);
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
    const data = await this.repo.findById(orgId, id);
    if (!data) throw new NotFoundException('Organization user not found');
    return data;
  }

  async update(orgId: number, id: number, dto: UpdateOrganizationUserDto) {

    const data = await this.repo.findById(orgId, +id);
    if (!data) throw new NotFoundException('Organization user not found');

    return this.usersRepo.update(+data.user_id, { name: dto.name })
  }

  async delete(orgId: number, id: number) {
    return this.repo.delete(orgId, id);
  }
}
