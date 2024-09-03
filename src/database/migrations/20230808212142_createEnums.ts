import { Knex } from 'knex';

import { ACCOUNT_STATUS_TYPE_TABLE, ROLE_TYPE_TABLE } from '../../configs/DBConfig';
import { AccountStatus, RoleType } from '../../enums';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ACCOUNT_STATUS_TYPE_TABLE, (table) => {
    table.specificType('id', 'serial').notNullable();
    table.string('status', 30).notNullable();
    table.primary(['status']);

    table.timestamps(true, true);
  });
  await knex(ACCOUNT_STATUS_TYPE_TABLE).insert(Object.values(AccountStatus).map((status) => ({ status })));

  await knex.schema.createTable(ROLE_TYPE_TABLE, (table) => {
    table.specificType('id', 'serial').notNullable();
    table.string('role', 15).notNullable();
    table.primary(['role']);

    table.timestamps(true, true);
  });
  await knex(ROLE_TYPE_TABLE).insert(Object.values(RoleType).map((role) => ({ role })));
}
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ACCOUNT_STATUS_TYPE_TABLE);
  await knex.schema.dropTable(ROLE_TYPE_TABLE);
}
