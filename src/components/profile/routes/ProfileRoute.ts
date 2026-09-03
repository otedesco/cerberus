import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { PrivateRoute, deserializeAccount, validateIncomingData } from '../../../middlewares';
import { ProfileController, ProfileDetailsController } from '../controllers';
import { ProfileDetailsValidator, ProfileValidator } from '../validators';

class ProfileRoute implements Route {
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
    // Profile
    this.router.get(`${this.path}/me`, asyncHandler(ProfileController.findMe));
    this.router.patch(`${this.path}/me`, validateIncomingData(ProfileValidator.update), asyncHandler(ProfileController.update));

    // Profile Details
    this.router.patch(`${this.path}/me/details`, validateIncomingData(ProfileDetailsValidator.createOrUpdate), asyncHandler(ProfileDetailsController.upsert));
    this.router.get(`${this.path}/me/details`, asyncHandler(ProfileDetailsController.findMe));
  }
}

export default new ProfileRoute();
