import { Knex } from 'knex';

import { ACCOUNT_EMERGENCY_CONTACT_TABLE, ACCOUNT_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ACCOUNT_EMERGENCY_CONTACT_TABLE, (table) => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()')).unique();
    table.string('name', 45).notNullable();
    table.string('phone_number', 45).notNullable();
    table.string('email', 45).notNullable();
    table.string('relationship', 45).notNullable();
    table.string('account_id').notNullable().references('id').inTable(ACCOUNT_TABLE).onDelete('CASCADE');

    table.timestamps(true, true);
  });

  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.bigint('emergency_contacts').defaultTo(null).references('id').inTable(ACCOUNT_EMERGENCY_CONTACT_TABLE);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ACCOUNT_EMERGENCY_CONTACT_TABLE);
}
