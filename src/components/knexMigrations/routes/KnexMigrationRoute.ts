import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { validateAdminApiKey, validateAllHeaders } from '../../../middlewares/HeadersValidator';
import { requesterInformation } from '../../../middlewares/RequesterInformation';
import { KnexMigrationController } from '../controllers';

const KNEX_MIGRATIONS_ADMIN_LOCK = '/knex-migrations';

class KnexMigrationRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = KNEX_MIGRATIONS_ADMIN_LOCK;
    this.router = Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.router.use(this.path, validateAllHeaders);
    this.router.use(this.path, validateAdminApiKey);
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/unlock`, requesterInformation, asyncHandler(KnexMigrationController.unlock));
    this.router.get(`${this.path}/list`, requesterInformation, asyncHandler(KnexMigrationController.list));
    this.router.post(`${this.path}/down`, requesterInformation, asyncHandler(KnexMigrationController.down));
    this.router.post(`${this.path}/up`, requesterInformation, asyncHandler(KnexMigrationController.up));
  }
}

export default new KnexMigrationRoute();
