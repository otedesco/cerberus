import { Knex } from 'knex';

import { ORGANIZATION_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ORGANIZATION_TABLE, (table) => {
    table.bigInteger('balance').notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table(ORGANIZATION_TABLE, (table) => {
    table.dropColumn('balance');
  });
}
