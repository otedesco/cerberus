import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { PrivateRoute, deserializeAccount, validateIncomingData, validateQuery } from '../../../middlewares';
import { SessionController, AccountDetailsController, AccountController } from '../controllers';
import { AccountDetailsValidator, AccountValidator } from '../validators';

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
    // Account
    this.router.patch(`${this.path}`, validateIncomingData(AccountValidator.update), asyncHandler(AccountController.update));
    this.router.post(
      `${this.path}/resend-verification-code`,
      validateQuery(AccountValidator.resendVerificationCode),
      asyncHandler(AccountController.resendVerificationCode),
    );

    // Sessions
    this.router.get(`${this.path}/sessions`, asyncHandler(SessionController.find));
    // Account Details
    this.router.get(`${this.path}/details`, asyncHandler(AccountDetailsController.findMe));
    this.router.patch(`${this.path}/details`, validateIncomingData(AccountDetailsValidator.update), asyncHandler(AccountDetailsController.update));
  }
}

export default new PrivateAccountRoute();
