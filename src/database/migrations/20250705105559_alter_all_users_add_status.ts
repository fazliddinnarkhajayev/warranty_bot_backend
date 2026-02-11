import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('technicians', (table) => {
    table
      .string('status', 32)
      .notNullable()
      .defaultTo('ACTIVE');
  });

  await knex.schema.alterTable('sellers', (table) => {
    table
      .string('status', 32)
      .notNullable()
      .defaultTo('ACTIVE');
  });

  await knex.schema.alterTable('customers', (table) => {
    table
      .string('status', 32)
      .notNullable()
      .defaultTo('ACTIVE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('technicians', (table) => {
    table.dropColumn('status');
  });

  await knex.schema.alterTable('sellers', (table) => {
    table.dropColumn('status');
  });

  await knex.schema.alterTable('customers', (table) => {
    table.dropColumn('status');
  });
}
