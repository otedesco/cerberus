import { Knex } from 'knex';

import { ACCOUNT_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ACCOUNT_TABLE, (table) => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()')).unique();
    table.string('email', 45).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('salt', 255).notNullable();

    table.timestamps(true, true);

    table.primary(['id', 'email']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ACCOUNT_TABLE);
}
