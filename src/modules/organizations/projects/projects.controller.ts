import { Controller, Post, Get, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('organizations/:orgId/projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Post()
  create(@Param('orgId') orgId: number, @Body() dto: CreateProjectDto) {
    return this.service.create(+orgId, dto);
  }

  @Get('')
  getAll(@Param('orgId') orgId: number, @Query() query: PaginationQueryDto) {
    return this.service.findAll(+orgId, query);
  }

  @Get(':id')
  getOne(@Param('orgId') orgId: number, @Param('id') id: number) {
    return this.service.findById(+orgId, +id);
  }

  @Put(':id')
  update(@Param('orgId') orgId: number, @Param('id') id: number, @Body() dto: UpdateProjectDto) {
    return this.service.update(+orgId, +id, dto);
  }

  @Delete(':id')
  remove(@Param('orgId') orgId: number, @Param('id') id: number) {
    return this.service.delete(+orgId, +id);
  }
}
