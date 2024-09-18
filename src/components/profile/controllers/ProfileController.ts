import { Request, Response } from 'express';

import { resolveResponse } from '../../../handlers';
import * as ProfileService from '../services/ProfileService';

export async function findMe(_req: Request, res: Response): Promise<void> {
  const { account } = res.locals;
  const { status, data } = await resolveResponse(ProfileService.findOne({ account: account.id }));

  res.status(status).json(data);
}
