import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('regions', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('code').notNullable();
    table.integer('created_by').nullable().unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
