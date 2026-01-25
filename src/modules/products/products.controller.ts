import { Controller, Get, Post, Param, Delete, Body, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) { }

  @Post()
  create(@Body() dto: CreateProductDto) {
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

