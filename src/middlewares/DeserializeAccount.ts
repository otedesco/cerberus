import { verify } from '@otedesco/commons';
import { LoggerFactory } from '@otedesco/server-utils';
import { Handler, NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import _ from 'lodash';

import { Account, AccountService, Session, SessionService } from '../components/account';
import { ProfileService } from '../components/profile';
import { Role } from '../components/roles';
import { PUBLIC_KEY, REFRESH_PUBLIC_KEY } from '../configs/AppConfig';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

const { logger } = LoggerFactory.getInstance(__filename);

const getAccessToken = (req: Request): string | null => _.get(req.cookies, 'accessToken', req.get('authorization')?.split(' ')[1] ?? null);

const getRefreshToken = (req: Request): string | null => _.get(req.cookies, 'refreshToken');

const getToken = (accessToken: string | null, refreshToken: string | null) =>
  accessToken ? { token: accessToken, publicKey: PUBLIC_KEY } : refreshToken ? { token: refreshToken, publicKey: REFRESH_PUBLIC_KEY } : null;

const verifyToken = (tokenInfo: { token: string; publicKey: string }) =>
  verify<{ email: Account['email']; signedSession: Session['id']; id: Account['id'] }>(tokenInfo.token, tokenInfo.publicKey);

const deserializeData = async (data: { email: string; signedSession: string; id: string }) => {
  const session = await SessionService.findOne({
    id: data.signedSession,
    accountId: data.id,
  });

  if (!session.active) throw new UnauthorizedException();
  const account = await AccountService.verifyAccount(data);
  const profile = await ProfileService.findOne({ accountId: account.id });
  const roles = profile?.roles ? _.keyBy(profile.roles as Role[], 'organizationId') : {};

  return { account, profile, roles, session };
};

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.account) return next();

  logger.info(`Account deserialization attempt ${new Date()}`);

  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshToken(req);

  if (!accessToken && !refreshToken) return next(new UnauthorizedException());

  // Extract token and publicKey
  const tokenInfo = getToken(accessToken, refreshToken);
  if (!tokenInfo) return next(new UnauthorizedException());

  // Verify token
  const data = verifyToken(tokenInfo);
  if (!data) return next(new UnauthorizedException());

  // Handle the deserialization logic
  const { account, profile, roles, session } = await deserializeData(data);

  // Avoid side effects until after all async tasks complete
  res.locals = { ...res.locals, account, profile, roles, session };

  logger.info(`Account deserialization success: ${JSON.stringify(data)}`);

  return next();
};

export const deserializeAccount: Handler = asyncHandler(middleware);
