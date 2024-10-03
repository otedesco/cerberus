import { Knex } from 'knex';

import { ACCOUNT_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.string('phone_number', 45).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(ACCOUNT_TABLE, (table) => {
    table.dropColumn('phone_number');
  });
}
