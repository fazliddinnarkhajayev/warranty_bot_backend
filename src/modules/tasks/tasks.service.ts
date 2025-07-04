import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SetDueDateTaskDto } from './dto/set-due-date-task.dto';
import { OrganizationUsersRepository } from '../organizations/users/organization-users.repository';
import { UsersRepository } from '../users/users.repository';
import { ChangeStatusDto } from './dto/change-status.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly repo: TasksRepository,
    private readonly usersRepo: UsersRepository
  ) { }

  create(dto: CreateTaskDto) {
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
    if (!org) throw new NotFoundException('Task not found');
    return org;
  }

  async getTasksGroupedByProject() {
    return this.repo.findTasksGroupedByProject();
  }

  async update(id: number, dto: UpdateTaskDto) {
    return this.repo.update(id, dto);
  }

  async assignUser(id: number, userId: number) {

    const orgUser = await this.usersRepo.findById(userId);
    if (!orgUser) throw new NotFoundException('User not found');

    const data = await this.repo.findById(id);
    if (!data) throw new NotFoundException('Task not found');

    data.worker_user_id = userId;
    return this.repo.update(id, data);
  }

  async setDueDate(id: number, dto: SetDueDateTaskDto) {

    const data = await this.repo.findById(id);
    if (!data) throw new NotFoundException('Task not found');

    data.due_date = dto.due_date;

    return this.repo.update(id, data);
  }

  async changeStatus(id: number, dto: ChangeStatusDto) {

    const data = await this.repo.findById(id);
    if (!data) throw new NotFoundException('Task not found');

    if(dto.status == 'IN_PROCESS' && data.status == 'IN_PROCESS') {
      throw new BadRequestException('Task is already in process');
    } else if((dto.status == 'IN_PROCESS' && data.status == 'DONE' || (dto.status == 'DONE' && data.status == 'DONE'))) {
      throw new BadRequestException('Task is already is done');
    } else if(dto.status == 'DONE' && data.status == 'CREATED') {
      throw new BadRequestException('Task is not in process');
    } 

    data.status = dto.status; 
    if(dto.status == 'DONE') {
      data.done_at = new Date();
    }

    return this.repo.update(id, data);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  async getUserTasksGroupedByProjects(userId: number, query: PaginationQueryDto) {
    const { pageIndex = 1, pageSize = 10 } = query;

    const offset = (pageIndex - 1) * pageSize;

    const [items, [{ count }]] = await Promise.all([
      this.repo.findUserTasksGroupedByProject(userId, offset, pageSize),
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

  async getUserTasksGroupedByStatuses(userId: number, query: PaginationQueryDto) {
    const { pageIndex = 1, pageSize = 10 } = query;

    const offset = (pageIndex - 1) * pageSize;

    const [items, [{ count }]] = await Promise.all([
      this.repo.getUserTasksGroupedByStatusPerProjectPaginated(userId, offset, pageSize),
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
}
