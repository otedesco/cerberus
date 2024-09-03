import { Route } from '@otedesco/server-utils';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { RoleType } from '../../../enums';
import { PrivateRoute, deserializeAccount, validateIncomingData, verifyRole } from '../../../middlewares';
import { OrganizationController as Controllers } from '../controllers';
import { createOrganizationSchema, inviteCollaboratorSchema } from '../validators/OrganizationValidator';

export class OrganizationRoute implements Route {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/organization';
    this.router = Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.router.use(deserializeAccount, PrivateRoute);
  }

  private initializeRoutes() {
    this.router.post(this.path, validateIncomingData(createOrganizationSchema), asyncHandler(Controllers.create));
    this.router.post(
      `${this.path}/invite`,
      verifyRole([RoleType.ADMIN, RoleType.OWNER]),
      validateIncomingData(inviteCollaboratorSchema),
      asyncHandler(Controllers.inviteCollaborator),
    );
    this.router.post(`${this.path}/:organizationId/accept-invitation/:invitationId`, asyncHandler(Controllers.acceptCollaborator));
  }
}
