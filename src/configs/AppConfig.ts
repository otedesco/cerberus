import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const environment = process.env;

export const APP_NAME = environment.APP_NAME || 'cerberus';
export const NODE_ENV = environment.NODE_ENV || 'development';
export const PORT = +environment.PORT! || 3000;

export const LOG_DIR = environment.LOG_DIR || '../logs';
export const LOG_FORMAT = environment.LOG_FORMAT || 'dev';

export const ORIGIN = environment.ORIGIN || '*';
export const CREDENTIALS = environment.CREDENTIALS === 'true' || false;

export const SECRET_KEY = environment.PRIVATE_KEY || 'super-secret-key';
export const PUBLIC_KEY = environment.PUBLIC_KEY || 'not-so-secret-key';
export const REFRESH_SECRET_KEY = environment.REFRESH_SECRET_KEY || 'super-secret-key';
export const REFRESH_PUBLIC_KEY = environment.REFRESH_PUBLIC_KEY || 'not-so-secret-key';
export const ADMIN_API_KEY = environment.ADMIN_API_KEY || 'admin';
export const USER_ID_HEADER = 'x-user-id';
export const API_KEY_HEADER = environment.API_KEY_HEADER || 'x-api-key';
export const TOKEN_EXPIRE = 7 * 24 * 60 * 60;
export const SESSION_EXPIRE = 15 * 24 * 60 * 60;
export const VERIFICATION_TOKEN_EXPIRE = 1 * 24 * 60 * 60;

export const PREFIX = environment.PREFIX || 'cerberus';

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  expires: new Date(Date.now() + TOKEN_EXPIRE * 100),
  maxAge: TOKEN_EXPIRE * 100,
  httpOnly: true,
  sameSite: 'lax',
  secure: NODE_ENV === 'production' || false,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...ACCESS_TOKEN_COOKIE_OPTIONS,
  expires: new Date(Date.now() + SESSION_EXPIRE * 100),
  maxAge: SESSION_EXPIRE * 100,
};

export const SALT_ROUNDS = Number(environment.SALT_ROUNDS) || 10;

export const PROMISE_CONCURRENCY = Number(environment.PROMISE_CONCURRENCY) || 10;

export const APP_CACHE_ENABLED = environment.APP_CACHE_ENABLED === 'true' || false;

export const REQUESTER = {
  userId: `aprt-re-${APP_NAME}-${NODE_ENV}`,
};
