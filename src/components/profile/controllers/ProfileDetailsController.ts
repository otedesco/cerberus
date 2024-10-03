import { Request, Response } from 'express';

import { resolveResponse } from '../../../handlers';
import { ProfileDetailsService } from '../services';

export async function upsert(req: Request, res: Response): Promise<void> {
  const { profile } = res.locals;
  const { status, data } = await resolveResponse(ProfileDetailsService.upsert(profile, req.body));

  res.status(status).json({ data });
}
