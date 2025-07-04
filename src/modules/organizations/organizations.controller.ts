import { Controller, Get, Post, Param, Body, Put, Delete, Query } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    console.log(dto)
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

  @Put('id/:id')
  update(@Param('id') id: number, @Body() dto: UpdateOrganizationDto) {
    return this.service.update(+id, dto);
  }

  @Delete('id/:id')
  remove(@Param('id') id: number) {
    return this.service.delete(+id);
  }
}
