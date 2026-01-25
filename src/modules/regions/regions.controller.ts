import { Controller, Get, Post, Param, Delete, Body, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { CreateRegionDto } from './dto/create-region.dto';
import { RegionsService } from './regions.service';

@Controller('regions')
export class RegionsController {
  constructor(private readonly service: RegionsService) { }

  @Post()
  create(@Body() dto: CreateRegionDto) {
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

