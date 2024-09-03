import { Knex } from 'knex';

import { ACCOUNT_TABLE, PROFILE_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(PROFILE_TABLE, (table) => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()')).unique();
    table.string('name', 45).notNullable();
    table.string('lastname', 45);
    table.string('avatar_url', 255);

    table.timestamps(true, true);

    table.primary(['id']);

    table.uuid('account').notNullable().references('id').inTable(ACCOUNT_TABLE);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(PROFILE_TABLE);
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.dropForeign('profile');
  });
}
