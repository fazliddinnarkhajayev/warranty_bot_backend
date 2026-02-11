import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: '167.86.94.200',
      port: 5432,
      user: 'postgres',
      password: '_postgres',
      database: 'test_db',
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
  },
};

export default config;
