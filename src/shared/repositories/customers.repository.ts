import { Injectable, NotFoundException } from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';

@Injectable()
export class CustomersRepository {
  constructor(private readonly knex: KnexService) { }

  private table = 'customers';

  async findAll(offset: number, limit: number) {
    return this.knex
      .getClient()(this.table)
      .select('*')
      .offset(offset)
      .limit(limit);
  }

  async findById(id: number) {
    return this.knex.getClient()(this.table).where({ id }).first();
  }

  async findByPhone(phone: string) {
    return this.knex.getClient()(this.table).where({ phone }).first();
  }


  async findByProductId(id: number) {
    return this.knex.getClient()(this.table).where({ product_id: id }).first();
  }

  async create(data: any) {
    const [user] = await this.knex
      .getClient()(this.table)
      .insert(data)
      .returning('*');
    return user;
  }

  async deleteById(id: number) {
    const data = await this.knex.getClient()(this.table).where({ id }).first();

    if (!data) {
      throw new NotFoundException(`Data not found`);
    }
    return this.knex.getClient()(this.table).where({ id }).del();
  }

  async countAll() {
    return this.knex.getClient()(this.table).count('* as count');
  }

  async update(id: number, data: { name?: string }) {
    const [res] = await this.knex
      .getClient()(this.table)
      .where({ id })
      .update(data)
      .returning('*');
    return res;
  }
}
