import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { PrivateRoute, deserializeAccount } from '../../../middlewares';
import { SessionController as Controller } from '../controllers';

class SessionsRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/account/sessions';
    this.router = Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.router.use(deserializeAccount, PrivateRoute);
  }

  private initializeRoutes() {
    this.router.get(this.path, asyncHandler(Controller.find));
  }
}

export default new SessionsRoute();
