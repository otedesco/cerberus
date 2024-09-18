import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { PrivateRoute, deserializeAccount } from '../../../middlewares';
import { ProfileController as Controllers } from '../controllers';

export class ProfileRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/profiles';
    this.router = Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.router.use(deserializeAccount, PrivateRoute);
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/me`, asyncHandler(Controllers.findMe));
  }
}
