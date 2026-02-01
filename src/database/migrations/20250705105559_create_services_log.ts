import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('services_logs', (table) => {
    table.increments('id');
    table.integer('product_id').references('id').inTable('products')
    table.integer('technician_id').references('id').inTable('technicians');
    table.string('problem').notNullable();
    table.string('solution').notNullable();
    table.string('price').notNullable();
    table.boolean('is_warranty').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('services_logs');
}
