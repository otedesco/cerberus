import { Request, Response } from 'express';

import { resolveResponse } from '../../../handlers';
import { ProfileService } from '../services';

export async function findMe(_req: Request, res: Response): Promise<void> {
  const { account } = res.locals;
  const { status, data } = await resolveResponse(ProfileService.findOne({ accountId: account.id }));

  res.status(status).json({ data });
}

export async function update(req: Request, res: Response): Promise<void> {
  const {
    profile: { id, accountId },
  } = res.locals;
  const { status, data } = await resolveResponse(ProfileService.update({ id, accountId, ...req.body }));

  res.status(status).json({ data });
}
