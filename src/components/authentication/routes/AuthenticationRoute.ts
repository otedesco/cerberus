import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { validateIncomingData } from '../../../middlewares';
import { AuthenticationController as Controller } from '../controllers';
import { AuthenticationValidator as Validator } from '../validators';

class AuthenticationRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/auth';
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/sign-up`, validateIncomingData(Validator.signUp), asyncHandler(Controller.signUp));
    this.router.post(`${this.path}/sign-in`, validateIncomingData(Validator.signIn), asyncHandler(Controller.signIn));
    this.router.post(`${this.path}/refresh-token`, asyncHandler(Controller.refreshAuthorization));
  }
}

export default new AuthenticationRoute();
