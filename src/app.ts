import { Cache } from '@otedesco/cache';
import { AppFactory, ConfigOptions, LoggerFactory } from '@otedesco/server-utils';
import { Model } from 'objection';

import {
  AccountRoute,
  AuthenticationRoute,
  KnexMigrationRoute,
  OrganizationRoute,
  PrivateAuthenticationRoute,
  ProfileRoute,
  RoleRoute,
  SessionsRoute,
} from './components';
import { APP_CACHE_ENABLED, PORT, CACHE_HOST, CACHE_PORT } from './configs';
import knex, { testDBConnection } from './database';
import { handleError, logError } from './middlewares';

const { logger } = LoggerFactory.getInstance(__filename);

const publicRoutes = [AuthenticationRoute, AccountRoute];
const privateRoutes = [PrivateAuthenticationRoute, OrganizationRoute, RoleRoute, ProfileRoute, SessionsRoute];
const adminRoutes = [KnexMigrationRoute];

const serverConfig: ConfigOptions = {
  routes: [
    { version: '/v1', routes: publicRoutes },
    { version: '/v1', routes: privateRoutes },
    { version: '/admin', routes: adminRoutes },
  ],
  logger,
  port: PORT,
};

class AuthServer extends AppFactory {
  initializeErrorHandling(): void {
    logger.info('Initializing error handlers middlewares');
    this.app.use(logError);
    this.app.use(handleError);
    logger.info('Error handlers middlewares initialized');
  }

  async initializePostgress() {
    logger.info('Initializing postgres DB connection');
    Model.knex(knex);
    await testDBConnection();
  }

  async initializeCache() {
    if (!APP_CACHE_ENABLED) {
      logger.warn('Cache is disabled');

      return;
    }

    logger.info('Initializing Cache connection');
    await Cache.init({
      socket: { host: CACHE_HOST, port: CACHE_PORT },
      logger,
    });
  }

  public async init() {
    const promises = (async () => {
      await Promise.all([this.initializePostgress(), this.initializeCache()]);
    })();

    await this.initializeConnections(promises);
    this.listen();
  }
}

export default new AuthServer(serverConfig);
