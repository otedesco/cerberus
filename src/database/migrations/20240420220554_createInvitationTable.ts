import { Knex } from 'knex';

import { INVITATION_TABLE, ORGANIZATION_TABLE, ROLE_TYPE_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(INVITATION_TABLE, (table) => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()')).unique();
    table.uuid('organization').references('id').inTable(ORGANIZATION_TABLE);
    table.string('email', 45).notNullable();
    table.string('role').notNullable().references('role').inTable(ROLE_TYPE_TABLE);

    table.timestamps(true, true);

    table.primary(['id']);
    table.unique(['email', 'organization']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(INVITATION_TABLE);
}
