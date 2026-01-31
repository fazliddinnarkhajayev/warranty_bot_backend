import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sellers', (table) => {
    table.increments('id');
    table.string('company').notNullable();
    table.string('phone').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.integer('district_id').nullable().unsigned().references('id').inTable('districts').onDelete('SET NULL');
    table.integer('region_id').nullable().unsigned().references('id').inTable('regions').onDelete('SET NULL');
    table.integer('created_by').nullable().unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sellers');
}
