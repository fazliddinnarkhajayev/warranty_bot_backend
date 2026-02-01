import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('customers', (table) => {
    table.increments('id');
    table.string('phone').nullable();
    table.string('first_name').nullable();
    table.string('last_name').nullable();
    table.string('telegram_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('last_login').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('customers');
}
