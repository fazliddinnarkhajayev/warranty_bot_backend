import { Controller, Post, Body, Param, Get, Patch, Query, Put, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SetDueDateTaskDto } from './dto/set-due-date-task.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) { }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.service.create(dto);
  }

  @Get()
  getAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get('id/:id')
  getOne(@Param('id') id: number) {
    return this.service.findById(+id);
  }

  @Get('projects')
  getTasksByProject() {
    return this.service.getTasksGroupedByProject();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTaskDto) {
    return this.service.update(+id, dto);
  }

  @Patch(':id/users/:userId/assign')
  assignUser(@Param('id') id: number, @Param('userId') userId: number) {
    return this.service.assignUser(+id, +userId);
  }
  
  @Patch(':id/due-date/assign')
  setDueDate(@Param('id') id: number, @Body() dto: SetDueDateTaskDto) {
    return this.service.setDueDate(+id, dto);
  }

  @Patch(':id/status')
  changeStatus(@Param('id') id: number, @Body() dto: ChangeStatusDto) {
    return this.service.changeStatus(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.delete(+id);
  }

  @Get('users/:userId/projects')
  getUserTasksGroupedByProjects(@Param('userId') userId: number, @Query() query: PaginationQueryDto) {
    return this.service.getUserTasksGroupedByProjects(+userId, query);
  }

  @Get('users/:userId/statuses')
  getUserTasksGroupedByStatuses(@Param('userId') userId: number, @Query() query: PaginationQueryDto) {
    return this.service.getUserTasksGroupedByStatuses(+userId, query);
  }
}
