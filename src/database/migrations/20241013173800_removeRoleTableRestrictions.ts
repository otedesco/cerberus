import { Knex } from 'knex';

import { ORGANIZATION_TABLE, PROFILE_TABLE, ROLE_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ROLE_TABLE, async (table) => {
    // Modify 'id' column to be a UUID instead of serial if it already exists
    if (await knex.schema.hasColumn(ROLE_TABLE, 'id')) {
      table.dropColumn('id');
    }

    // Add new 'id' column as a UUID with default value
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    // Make organization_id nullable
    table.uuid('organization_id').nullable().alter();

    // Drop unique constraint on profile_id, organization_id, and role
    table.dropUnique(['profile_id', 'organization_id', 'role']);

    // Ensure profile_id is not nullable
    table.uuid('profile_id').notNullable().alter();

    // Maintain foreign key relationships
    table.foreign('profile_id').references('id').inTable(PROFILE_TABLE);
    table.foreign('organization_id').references('id').inTable(ORGANIZATION_TABLE);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ROLE_TABLE, (table) => {
    // Revert 'id' column back to serial
    table.dropColumn('id');
    table.specificType('id', 'serial').notNullable().unique();

    // Make organization_id not nullable again
    table.uuid('organization_id').notNullable().alter();

    // Re-add unique constraint on profile_id, organization_id, and role
    table.unique(['profile_id', 'organization_id', 'role']);

    // Revert profile_id to be nullable
    table.uuid('profile_id').alter();

    table.timestamps(true, true);
  });
}
