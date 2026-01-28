import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('warranty_histories', (table) => {
    table.increments('id');
    table
      .integer('product_id')
      .notNullable()
      .references('id')
      .inTable('products');
    table
      .integer('seller_id')
      .notNullable()
      .references('id')
      .inTable('sellers');
    table.string('phone').notNullable();
    table.string('status').notNullable().defaultTo('CREATED');
    table.timestamp('activated_at').nullable();
    table
      .integer('created_by')
      .nullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
