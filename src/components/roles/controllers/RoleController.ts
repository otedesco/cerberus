import { Request, Response } from 'express';

import { createResponse, resolveResponse } from '../../../handlers';
import { Profile } from '../../profile';
import { RoleService } from '../services';

export async function find(_req: Request, res: Response): Promise<void> {
  const profile: Profile = res.locals.profile;
  const { status, data } = await resolveResponse(RoleService.find({ profileId: profile.id }));

  res.status(status).json({ data });
}

export async function create(req: Request, res: Response): Promise<void> {
  const profile: Profile = res.locals.profile;
  const { role, avatarUrl } = req.body;
  const { status, data } = await createResponse(RoleService.create({ role, avatarUrl, profileId: profile.id }));

  res.status(status).json({ data });
}
