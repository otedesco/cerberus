import { Knex } from 'knex';

import { PROFILE_DETAILS_TABLE, PROFILE_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(PROFILE_DETAILS_TABLE, (table) => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()')).unique();
    table.string('location', 255).nullable();
    table.string('school', 255).nullable();
    table.string('work', 255).nullable();
    table.json('languages').notNullable().defaultTo('[]');
    table.date('birthdate').nullable();
    table.string('gender', 45).nullable();
    table.string('marital_status', 45).nullable();
    table.string('nationality', 45).nullable();
    table.string('about', 400).nullable();

    table.specificType('profile_id', 'uuid').notNullable().unique();
    table.foreign('profile_id').references('id').inTable(PROFILE_TABLE).onDelete('CASCADE');

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(PROFILE_DETAILS_TABLE);
}
