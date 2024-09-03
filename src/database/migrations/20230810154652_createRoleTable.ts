import { Knex } from 'knex';

import { ORGANIZATION_TABLE, PROFILE_TABLE, ROLE_TABLE, ROLE_TYPE_TABLE } from '../../configs/DBConfig';
import { RoleType } from '../../enums';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ROLE_TABLE, (table) => {
    table.specificType('id', 'serial').notNullable().unique();
    table.string('role').notNullable().defaultTo(RoleType.OWNER).references('role').inTable(ROLE_TYPE_TABLE);
    table.uuid('profile_id').index();
    table.foreign('profile_id').references('id').inTable(PROFILE_TABLE);
    table.uuid('organization_id').index();
    table.foreign('organization_id').references('id').inTable(ORGANIZATION_TABLE);

    table.unique(['profile_id', 'organization_id', 'role']);
    table.primary(['id']);

    table.timestamps(true, true);
  });

  await knex.schema.alterTable(PROFILE_TABLE, (table) => {
    table.bigint('roles').defaultTo(null).references('id').inTable(ROLE_TABLE);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ROLE_TABLE);
}
