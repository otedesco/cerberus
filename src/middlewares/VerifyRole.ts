import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import { Organization } from '../components/organization';
import { Role } from '../components/roles';
import { RoleType } from '../enums';
import { ForbiddenException } from '../exceptions';

export const verifyRole =
  (allowedRoles: (typeof RoleType)[keyof typeof RoleType][] = [RoleType.ADMIN, RoleType.OWNER]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizationId = _.get(req.headers, 'x-organization-id', null) as string | null;
      if (!organizationId) return next(new ForbiddenException());

      const roles: Record<Organization['id'], Role> = res.locals.roles;
      if (!roles[organizationId]) return next(new ForbiddenException());

      const organizationRole = roles[organizationId];
      if (!allowedRoles.includes(organizationRole.role)) return next(new ForbiddenException());
      res.locals.organizaionId = organizationId;

      return next();
    } catch (err: any) {
      return next(err);
    }
  };
