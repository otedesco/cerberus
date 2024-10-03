import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const environment = process.env;

// DB CONFIG
export const CONNECTION = environment.PG_CONNECTION || 'postgres://postgres:postgres@127.0.0.1:5432/db';
export const TIMEOUT = Number(environment.DB_TIMEOUT) || 200;
export const CONNECTION_KEEP_ALIVE_TIMEOUT = Number(environment.CONNECTION_KEEP_ALIVE_TIMEOUT) || 60000;
export const CONNECTION_POOL_SIZE = Number(environment.DB_CONNECTION_POOL_SIZE) || 20;
export const DEBUG = environment.DB_DEBUG === 'true' || false;
export const SEEDS_DIRECTORY = environment.SEEDS_DIRECTORY || environment.NODE_ENV === 'production' ? './dist/database/seeds' : './src/database/seeds';
export const MIGRATIONS_DIRECTORY =
  environment.MIGRATIONS_DIRECTORY || environment.NODE_ENV === 'production' ? './dist/database/migrations' : './src/database/migrations';
// TABLE NAMES
export const MIGRATIONS_TABLE = 'knex_migrations';
export const ACCOUNT_TABLE = 'accounts';
export const PROFILE_TABLE = 'profiles';
export const ROLE_TABLE = 'roles';
export const ORGANIZATION_TABLE = 'organizations';
export const SESSION_TABLE = 'sessions';
export const ACCOUNT_STATUS_TYPE_TABLE = 'account_status_types';
export const ROLE_TYPE_TABLE = 'role_types';
export const INVITATION_TABLE = 'invitations';
export const ACCOUNT_DETAILS_TABLE = 'account_details';
export const ACCOUNT_EMERGENCY_CONTACT_TABLE = 'account_emergency_contact';
export const PROFILE_DETAILS_TABLE = 'profile_details';

// DB UTILITIES CONFIGS
export const CURSOR_BATCH_SIZE = 500;
