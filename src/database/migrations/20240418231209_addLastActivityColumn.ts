import { Knex } from 'knex';

import { SESSION_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(SESSION_TABLE, (table) => {
    table.string('last_activity_log', 255);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(SESSION_TABLE, (table) => {
    table.dropColumn('last_activity_log');
  });
}
