import { Knex } from 'knex';

import { ACCOUNT_DETAILS_TABLE, ACCOUNT_TABLE } from '../../configs/DBConfig';
import { VerificationStatusEnum } from '../../enums';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ACCOUNT_DETAILS_TABLE, (table) => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()')).unique();
    table.string('email_verification_status').notNullable().defaultTo(VerificationStatusEnum.VERIFICATION_PENDING);
    table.string('phone_verification_status').notNullable().defaultTo(VerificationStatusEnum.VERIFICATION_PENDING);
    table.string('identity_verification_status').notNullable().defaultTo(VerificationStatusEnum.VERIFICATION_PENDING);
    table.string('legal_firstname').nullable();
    table.string('legal_lastname').nullable();
    table.string('goverment_id').nullable();
    table.string('address').nullable();
    table.string('city').nullable();
    table.string('state').nullable();
    table.string('zipcode').nullable();
    table.string('country').nullable();
    table.specificType('account_id', 'uuid').notNullable().unique();
    table.foreign('account_id').references('id').inTable(ACCOUNT_TABLE).onDelete('CASCADE');

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.dropColumn('details_id');
  });

  await knex.schema.dropTable(ACCOUNT_DETAILS_TABLE);
}
