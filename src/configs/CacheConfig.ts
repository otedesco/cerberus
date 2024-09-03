import { config } from 'dotenv';

import { PREFIX } from './AppConfig';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const environment = process.env;

export const CACHE_PORT = Number(environment.CACHE_PORT) || 6379;
export const CACHE_HOST = environment.CACHE_HOST || 'localhost';
export const CACHE_PREFIX = environment.CACHE_PREFIX || PREFIX;
export const KEY_SEPARATOR = environment.CACHE_KEY_SEPARATOR || ':';
export const TTL = 3600;

export const ACCOUNT_CACHE_ENABLED = environment.ACCOUNT_CACHE_ENABLED == 'true' || false;
export const SESSION_CACHE_ENABLED = environment.SESSION_CACHE_ENABLED == 'true' || false;
export const PROFILE_CACHE_ENABLED = environment.PROFILE_CACHE_ENABLED == 'true' || false;
export const ORGANIZATION_CACHE_ENABLED = environment.ORGANIZATION_CACHE_ENABLED == 'true' || false;
