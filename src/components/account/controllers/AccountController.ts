import { Request, Response } from 'express';
import _ from 'lodash';

import { createResponse } from '../../../handlers';
import { Account } from '../interfaces/Account';
import { AccountService } from '../services';

export async function verify(req: Request, res: Response): Promise<void> {
  const token = _.get(req.headers, 'x-verification-token', null) as string;
  const { otp } = req.body;
  const { status, data } = await createResponse(AccountService.verifyEmail({ token, otp }), { code: 204 });

  res.status(status).json({ data });
}

export async function recovery(req: Request, res: Response): Promise<void> {
  const payload: Partial<Account> = req.body;
  const { status, data } = await createResponse(AccountService.recovery(payload), { code: 204 });

  res.status(status).json({ data });
}

export async function changePassword(req: Request, res: Response) {
  const payload: Partial<Account> = req.body;
  const { token } = req.query as { token: string };
  const { status, data } = await createResponse(AccountService.changePassword(payload, token), { code: 204 });

  res.status(status).json({ data });
}

export const resendVerificationCode = async (req: Request, res: Response) => {
  const { account } = res.locals;
  const { method } = req.query as { method: 'email' | 'sms' | undefined };

  const { status, data } = await createResponse(AccountService.resendVerificationCode(account, method));

  res.status(status).json({ data });
};

export const update = async (req: Request, res: Response) => {
  const payload: Partial<Account> = req.body;
  const { account } = res.locals;

  const { status, data } = await createResponse(AccountService.update({ ...payload, id: account.id, email: account.email }), { code: 204 });

  res.status(status).json({ data });
};
