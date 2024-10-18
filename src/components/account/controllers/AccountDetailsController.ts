import { Request, Response } from 'express';

import { resolveResponse } from '../../../handlers';
import { AccountDetail } from '../interfaces';
import { AccountDetailsService } from '../services';

export async function update(req: Request, res: Response) {
  const payload: Partial<AccountDetail> = req.body;
  const { account } = res.locals;
  const { status, data } = await resolveResponse(AccountDetailsService.upsert(account.id, payload));

  res.status(status).json({ data });
}

export async function findMe(_req: Request, res: Response) {
  const { account } = res.locals;
  const { status, data } = await resolveResponse(AccountDetailsService.findOne({ accountId: account.id }));

  res.status(status).json({ data });
}
