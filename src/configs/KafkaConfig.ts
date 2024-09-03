import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const environment = process.env;

export const KAFKA_CLIENT_HOST = environment.KAFKA_CLIENT_HOST || '127.0.0.1:9092';
export const KAFKA_CLIENT_MAX_TIMEOUT = +environment.KAFKA_CLIENT_MAX_TIMEOUT! || 30000;
export const KAFKA_CLIENT_MAX_RECONNECTION_ATTEMPTS = +environment.KAFKA_CLIENT_MAX_RECONNECTION_ATTEMPTS! || 10;
export const KAFKA_CLIENT_ENABLE_LOGS = environment.KAFKA_CLIENT_ENABLE_LOGS === 'true';
export const KAFKA_CLIENT_SSL = environment.KAFKA_CLIENT_SSL === 'true';
export const KAFKA_CLIENT_ID = environment.KAFKA_CLIENT_ID || '';
