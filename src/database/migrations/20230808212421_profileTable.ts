import { Knex } from 'knex';

import { ACCOUNT_TABLE, PROFILE_TABLE } from '../../configs/DBConfig'; // Adjust the path according to your project structure

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(PROFILE_TABLE, (table) => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()')).unique();

    table.specificType('account_id', 'uuid').notNullable().unique();
    table.foreign('account_id').references('id').inTable(ACCOUNT_TABLE).onDelete('CASCADE');

    table.string('name', 100).notNullable();
    table.string('lastname', 100).notNullable();
    table.string('avatar_url', 255).nullable();

    table.timestamps(true, true);

    table.primary(['id']);
  });
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.uuid('profile_id').notNullable().unique().references('id').inTable(PROFILE_TABLE).onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(PROFILE_TABLE);
}
