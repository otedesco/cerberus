import { Knex } from 'knex';

import { ACCOUNT_TABLE, SESSION_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(SESSION_TABLE, (table) => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()')).unique();
    table.boolean('active').notNullable().defaultTo(true);

    // Foreign key for the one-to-many relationship
    table.uuid('account_id').notNullable().index();
    table.foreign('account_id').references('id').inTable(ACCOUNT_TABLE).onDelete('CASCADE');

    table.timestamps(true, true);

    // Primary key for the session table
    table.primary(['id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the SESSION_TABLE first
  await knex.schema.dropTable(SESSION_TABLE);
}
