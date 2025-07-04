import { Controller, Get, Post, Param, Body, Put, Delete, Query } from '@nestjs/common';
import { OrganizationUsersService } from './organization-users.service';
import { CreateOrganizationUserDto } from './dto/create-organization-user.dto';
import { UpdateOrganizationUserDto } from './dto/update-organization-user.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';

@Controller('organizations/:orgId/users')
export class OrganizationUsersController {
  constructor(private readonly service: OrganizationUsersService) { }

  @Post()
  create(@Param('orgId') orgId: number, @Body() dto: CreateOrganizationUserDto) {
    return this.service.create(+orgId, dto);
  }

  @Get()
  getAll(@Param('orgId') orgId: number, @Query() query: PaginationQueryDto) {
    return this.service.findAll(orgId, query);
  }

  @Get(':id')
  getOne(@Param('orgId') orgId: number, @Param('id') id: number) {
    return this.service.findById(+orgId, +id);
  }

  @Put(':id')
  update(@Param('orgId') orgId: number, @Param('id') id: number, @Body() dto: UpdateOrganizationUserDto) {
    return this.service.update(+orgId, +id, dto);
  }

  @Delete(':id')
  remove(@Param('orgId') orgId: number, @Param('id') id: number) {
    return this.service.delete(+orgId, +id);
  }
}
