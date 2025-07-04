import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('projects', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.integer('org_id').unsigned().notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('projects');
}


