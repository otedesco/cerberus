import { Knex } from 'knex';

import { ROLE_TYPE_TABLE } from '../../configs/DBConfig';
import { RoleType } from '../../enums';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ROLE_TYPE_TABLE, (table) => {
    table.specificType('id', 'serial').notNullable();
    table.string('role', 15).notNullable();
    table.primary(['role']);

    table.timestamps(true, true);
  });
  await knex(ROLE_TYPE_TABLE).insert(Object.values(RoleType).map((role) => ({ role })));
}
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ROLE_TYPE_TABLE);
}
