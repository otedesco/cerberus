import { MIGRATIONS_DIRECTORY, MIGRATIONS_TABLE, SEEDS_DIRECTORY } from './src/configs/DBConfig';
import { dbConnection } from './src/database';

const db = {
  ...dbConnection,
  migrations: {
    tableName: MIGRATIONS_TABLE,
    directory: MIGRATIONS_DIRECTORY,
  },
  seeds: {
    directory: SEEDS_DIRECTORY,
  },
};

export default db;
