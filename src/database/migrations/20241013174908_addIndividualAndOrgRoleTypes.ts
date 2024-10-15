import { Knex } from 'knex';

import { ROLE_TYPE_TABLE } from '../../configs/DBConfig';
import { RoleType } from '../../enums';

const newRoles = [
  RoleType.BASIC_AGENT,
  RoleType.BASIC_USER,
  RoleType.ORGANIZATION_ADMIN,
  RoleType.ORGANIZATION_AGENT,
  RoleType.ORGANIZATION_OWNER,
  RoleType.ORGANIZATION_READ_ONLY,
  RoleType.ORGANIZATION_WRITE,
];
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ROLE_TYPE_TABLE, (table) => {
    table.string('role', 30).alter({ alterNullable: false });
  });
  await knex(ROLE_TYPE_TABLE).insert(newRoles.map((role) => ({ role })));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ROLE_TYPE_TABLE, (table) => {
    table.string('role', 15).notNullable().alter();
  });
  await knex(ROLE_TYPE_TABLE).whereIn('role', newRoles).delete();
}
