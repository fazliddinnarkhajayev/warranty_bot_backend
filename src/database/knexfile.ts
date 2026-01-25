import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: '2000',
      database: 'warranty_bot',
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
  },
};

export default config;
