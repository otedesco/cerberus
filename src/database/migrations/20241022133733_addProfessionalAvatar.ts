import { Knex } from 'knex';

import { ROLE_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ROLE_TABLE, (table) => {
    table.string('avatar_url', 255).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ROLE_TABLE, (table) => {
    table.dropColumn('avatar_url');
  });
}
