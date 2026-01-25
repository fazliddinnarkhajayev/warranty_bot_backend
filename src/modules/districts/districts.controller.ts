import { Controller, Get, Post, Param, Delete, Body, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { CreateDistrictDto } from './dto/create-district.dto';
import { DistrictsService } from './districts.service';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly service: DistrictsService) { }

  @Post()
  create(@Body() dto: CreateDistrictDto) {
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

