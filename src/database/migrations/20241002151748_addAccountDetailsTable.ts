import { Knex } from 'knex';

import { ACCOUNT_DETAILS_TABLE, ACCOUNT_TABLE } from '../../configs/DBConfig';
import { VerificationStatusEnum } from '../../enums';

export async function up(knex: Knex): Promise<void> {
  // Create ACCOUNT_DETAILS_TABLE
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

    // Timestamps for created_at and updated_at
    table.timestamps(true, true);
  });

  // Alter ACCOUNT_TABLE to reference ACCOUNT_DETAILS_TABLE for one-to-one relationship
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.uuid('details_id').unique().references('id').inTable(ACCOUNT_DETAILS_TABLE).onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove the 'details_id' column from ACCOUNT_TABLE
  await knex.schema.alterTable(ACCOUNT_TABLE, (table) => {
    table.dropColumn('details_id');
  });

  // Drop the ACCOUNT_DETAILS_TABLE
  await knex.schema.dropTable(ACCOUNT_DETAILS_TABLE);
}
