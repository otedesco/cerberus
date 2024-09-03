import { Cache } from '@otedesco/cache';
import { AppFactory, ConfigOptions, LoggerFactory } from '@otedesco/server-utils';
import { Model } from 'objection';

import { AccountRoute, AuthenticationRoute, OrganizationRoute, PrivateAuthenticationRoute, RoleRoute } from './components';
import { APP_CACHE_ENABLED, PORT, CACHE_HOST, CACHE_PORT } from './configs';
import knex, { testDBConnection } from './database';
import { handleError, logError } from './middlewares';

const { logger } = LoggerFactory.getInstance(__filename);

const publicRoutes = [new AuthenticationRoute(), new AccountRoute()];
const privateRoutes = [new PrivateAuthenticationRoute(), new OrganizationRoute(), new RoleRoute()];

const serverConfig: ConfigOptions = {
  routes: [
    { version: '/v1', routes: publicRoutes },
    { version: '/v1', routes: privateRoutes },
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
