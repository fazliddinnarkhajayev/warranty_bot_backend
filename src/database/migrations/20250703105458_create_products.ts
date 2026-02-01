import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('code').notNullable();
    table.string('model').notNullable();
    table.string('warranty_months').notNullable();
    table.string('status').notNullable().defaultTo('CREATED');
    table.integer('created_by').nullable().unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products');
}
