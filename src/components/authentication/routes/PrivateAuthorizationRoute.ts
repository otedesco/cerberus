import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { deserializeAccount, PrivateRoute } from '../../../middlewares';
import * as Controller from '../controllers/AuthenticationController';

export class PrivateAuthenticationRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/auth';
    this.router = Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.router.use(deserializeAccount, PrivateRoute);
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/sign-out`, asyncHandler(Controller.signOut));
  }
}
