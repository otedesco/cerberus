import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { PrivateRoute, deserializeAccount } from '../../../middlewares';
import { SessionController, AccountDetailsController } from '../controllers';

class PrivateAccountRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/account';
    this.router = Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.router.use(deserializeAccount, PrivateRoute);
  }

  private initializeRoutes() {
    // Sessions
    this.router.get(`${this.path}/sessions`, asyncHandler(SessionController.find));
    // Account Details
    this.router.get(`${this.path}/details`, asyncHandler(AccountDetailsController.findMe));
    this.router.patch(`${this.path}/details`, asyncHandler(AccountDetailsController.update));
  }
}

export default new PrivateAccountRoute();
