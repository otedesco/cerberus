import { Knex } from 'knex';

import { ACCOUNT_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.boolean('active').notNullable().defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(ACCOUNT_TABLE, (table) => {
    table.dropColumn('active');
  });
}
