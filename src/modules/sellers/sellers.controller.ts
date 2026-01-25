import { Controller, Get, Post, Param, Delete, Body, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SellersService } from './sellers.service';

@Controller('sellers')
export class SellersController {
  constructor(private readonly service: SellersService) { }

  @Post()
  create(@Body() dto: CreateSellerDto) {
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

