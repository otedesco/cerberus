import { Request, Response } from 'express';

import { resolveResponse, success } from '../../../handlers';
import { Account } from '../interfaces';
import { SessionService } from '../services';

export async function find(_req: Request, res: Response) {
  const payload: Account = res.locals.account;
  const { status, data } = await resolveResponse(SessionService.find(payload), { defaultResponse: [], notFoundHandler: success });

  res.status(status).json(data);
}
