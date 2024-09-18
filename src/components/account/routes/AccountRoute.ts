import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { validateIncomingData, validateQuery } from '../../../middlewares';
import * as Controller from '../controllers/AccountController';
import * as Validator from '../validators/AccountValidator';

export class AccountRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/account';
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/verify`, validateIncomingData(Validator.emailVerification), asyncHandler(Controller.verify));
    this.router.post(`${this.path}/recovery`, validateIncomingData(Validator.recovery), asyncHandler(Controller.recovery));
    this.router.post(
      `${this.path}/change-password`,
      validateIncomingData(Validator.changePassword),
      validateQuery(Validator.emailVerification),
      asyncHandler(Controller.changePassword),
    );
  }
}
