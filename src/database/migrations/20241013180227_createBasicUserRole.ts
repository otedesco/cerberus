import { Knex } from 'knex';

import { PROFILE_TABLE, ROLE_TABLE } from '../../configs/DBConfig';
import { RoleType } from '../../enums';

export async function up(knex: Knex): Promise<void> {
  const profiles = await knex(PROFILE_TABLE).select('id');

  if (profiles.length > 0) {
    await knex(ROLE_TABLE).insert(
      profiles.map((profile) => ({
        profile_id: profile.id,
        organization_id: null,
        role: RoleType.BASIC_USER,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      })),
    );
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex(ROLE_TABLE).where('role', RoleType.BASIC_USER).delete();
}
