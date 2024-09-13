import { LoggerFactory } from '@otedesco/server-utils';

import { MIGRATIONS_DIRECTORY, MIGRATIONS_TABLE } from '../../../configs';
import Db from '../../../database';

const { logger } = LoggerFactory.getInstance(__filename);

const migrationConfig = {
  tableName: MIGRATIONS_TABLE,
  directory: MIGRATIONS_DIRECTORY,
};

export async function unlock(requester: Record<string, string>): Promise<string> {
  logger.info(`Knex-migrations-unlock: requester ${JSON.stringify(requester, null, 2)}`);
  try {
    await Db.migrate.forceFreeMigrationsLock({ ...migrationConfig });

    return 'Knex-migrations-unlocked';
  } catch (err) {
    return `Knex-migrations-unlock: Error ${err}`;
  }
}
export async function listMigrations(requester: Record<string, string>): Promise<any> {
  logger.info(`Knex-migrations-list: requester ${JSON.stringify(requester, null, 2)}`);

  return Db.migrate.list({ ...migrationConfig });
}
export async function down(config: object, requester: Record<string, string>): Promise<any> {
  logger.info(`Knex-migrations-down: requester ${JSON.stringify(requester, null, 2)}`);

  return Db.migrate.down({ ...migrationConfig, ...config });
}
export async function up(config: object, requester: Record<string, string>): Promise<void> {
  logger.info(`Knex-migrations-up: requester ${JSON.stringify(requester, null, 2)}`);

  return Db.migrate.up({ ...migrationConfig, ...config });
}
