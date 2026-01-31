import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/shared/dto/pagination.dto';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SellersRepository } from './sellers.repository';

@Injectable()
export class SellersService {
  constructor(private readonly repo: SellersRepository) {}

  async create(dto: CreateSellerDto) {
    return this.repo.create(dto);
  }

  async getById(id: number) {
    const seller = await this.repo.findById(id);
    if (!seller) throw new NotFoundException('Seller not found');
    return seller;
  }

  async getByPhone(phone: string) {
    const user = await this.repo.findByPhone(phone);
    return user;
  }

  async getByTelegramId(telegramId: string) {
    const user = await this.repo.findByTelegramId(telegramId);
    return user;
  }

  async setTelegramId(id: number, telegramId: string) {
    const user = await this.repo.updateTelegramId(id, telegramId);
    return user;
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
