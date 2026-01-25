import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {

  constructor(private readonly repo: ProductsRepository) { }

  async create(dto: CreateProductDto) {
    return this.repo.create(dto);
  }

  async getById(id: number) {
    const data = await this.repo.findById(id);
    if (!data) throw new NotFoundException('Product not found');
    return data;
  }

  async getAll(query: PaginationQueryDto) {

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

  async delete(id: number) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('Seller not found');
    return this.repo.deleteById(id);
  }
}
