import { Injectable, NotFoundException } from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';

@Injectable()
export class ServicesLogsRepository {
  constructor(private readonly knex: KnexService) { }

  private table = 'services_logs';

  async findAll(offset: number, limit: number) {
    return this.knex
      .getClient()(this.table)
      .select('*')
      .offset(offset)
      .limit(limit);
  }

  async findAllByTechnicianPhone(phone: string) {
    return this.knex
      .getClient()(this.table + ' as sl')
      .select([
        'sl.id',
        'sl.problem',
        'sl.solution',
        'sl.is_warranty',
        'sl.price',
        'sl.created_at',

        'p.id as product_id',
        'p.name as product_name',
        'p.code as product_code',

        't.id as technician_id',
        't.phone as technician_phone',
      ])
      .leftJoin('technicians as t', 't.id', 'sl.technician_id')
      .leftJoin('products as p', 'p.id', 'sl.product_id')
      .where('t.phone', phone)
      .orderBy('sl.created_at', 'desc');
  }

  async findById(id: number) {
    return this.knex.getClient()(this.table).where({ id }).first();
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

  async update(id: number, data: any) {
    const [res] = await this.knex
      .getClient()(this.table)
      .where({ id })
      .update(data)
      .returning('*');
    return res;
  }
}
