import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { deserializeAccount, PrivateRoute } from '../../../middlewares';
import * as Controller from '../controllers/RoleController';

export class RoleRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/role';
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
