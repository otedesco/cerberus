import { Request, Response } from 'express';
import _ from 'lodash';

import { createResponse } from '../../../handlers';
import { Account } from '../../account';
import { OrganizationService, InvitationService } from '../services';

export async function create({ body }: Request, res: Response): Promise<void> {
  const account: Account = res.locals.account;
  const { status, data } = await createResponse(OrganizationService.create(account, body));

  res.status(status).json(data);
}

export async function inviteCollaborator(req: Request, res: Response): Promise<void> {
  const role = _.get(res.locals.roles, res.locals.organizaionId);
  const { status, data } = await createResponse(OrganizationService.inviteCollaborator(req.body, role));

  res.status(status).json(data);
}

export async function acceptCollaborator(req: Request, res: Response): Promise<void> {
  const { organizationId, invitationId } = req.params;
  const { profile } = res.locals;
  const { status, data } = await createResponse(InvitationService.accept(profile, organizationId, invitationId));
  res.status(status).json(data);
}
