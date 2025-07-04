import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE');
    table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.integer('worker_user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.enum('status', ['CREATED', 'IN_PROCESS', 'DONE']).defaultTo('CREATED');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('due_date').nullable();
    table.timestamp('done_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks');
}

