import { ACCOUNT_STATUS_TYPE_TABLE, ACCOUNT_TABLE } from 'configs';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.dropColumn('status');
  });
  await knex.schema.dropTable(ACCOUNT_STATUS_TYPE_TABLE);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable(ACCOUNT_STATUS_TYPE_TABLE, (table) => {
    table.string('status').notNullable().primary();
  });

  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.string('status').notNullable().references('status').inTable(ACCOUNT_STATUS_TYPE_TABLE);
  });
}
