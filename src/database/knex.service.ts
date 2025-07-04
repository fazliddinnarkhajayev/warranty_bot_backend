import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import knex, { Knex } from 'knex';
import knexConfig from './knexfile';

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy {
  private knex: Knex;

  async onModuleInit() {
    this.knex = knex(knexConfig.development);
  }

  async onModuleDestroy() {
    await this.knex?.destroy();
  }

  getClient(): Knex {
    return this.knex;
  }
}
