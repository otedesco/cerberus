import { Request, Response } from 'express';

import { resolveResponse } from '../../../handlers';
import { Profile } from '../../profile';
import { RoleService } from '../services';

export async function find(_req: Request, res: Response): Promise<void> {
  const profile: Profile = res.locals.profile;
  const { status, data } = await resolveResponse(RoleService.find({ profileId: profile.id }));

  res.status(status).json({ data });
}
