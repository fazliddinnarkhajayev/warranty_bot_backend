import { Controller, Get, Post, Param, Delete, Body, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { TechniciansService } from './technicians.service';

@Controller('technicians')
export class TechniciansController {
  constructor(private readonly service: TechniciansService) { }

  @Post()
  create(@Body() dto: CreateTechnicianDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.getById(+id);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.getAll(query);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.delete(+id);
  }
}

