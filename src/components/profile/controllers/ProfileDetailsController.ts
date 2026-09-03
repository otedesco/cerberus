import { Request, Response } from 'express';

import { resolveResponse } from '../../../handlers';
import { ProfileDetailsService } from '../services';

export async function upsert(req: Request, res: Response): Promise<void> {
  const { profile } = res.locals;
  const { status, data } = await resolveResponse(ProfileDetailsService.upsert(profile, req.body));

  res.status(status).json({ data });
}

export async function findMe(_req: Request, res: Response): Promise<void> {
  const { profile } = res.locals;
  const { status, data } = await resolveResponse(ProfileDetailsService.findOne({ profileId: profile.id }));

  res.status(status).json({ data });
}
