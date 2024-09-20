import { verify } from '@otedesco/commons';
import { LoggerFactory } from '@otedesco/server-utils';
import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import { AccountService } from '../components/account/services';
import { ProfileService } from '../components/profile';
import { Role } from '../components/roles';
import { PUBLIC_KEY, REFRESH_PUBLIC_KEY } from '../configs/AppConfig';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';

const { logger } = LoggerFactory.getInstance(__filename);

function getAccessToken(req: Request): string | null {
  const authorizationHeader = req.get('authorization');
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) return authorizationHeader.split(' ')[1];
  const authorizationCookie = _.get(req.cookies, 'access_token', null);
  if (authorizationCookie) return authorizationCookie;

  return null;
}

function getRefreshToken({ cookies }: Request): string | null {
  const refreshToken = _.get(cookies, 'refresh_token');

  return refreshToken;
}

export async function deserializeAccount(req: Request, res: Response, next: NextFunction) {
  // FIXME: For some reason this middleware is being executed 3 times on the same request
  //        (hit GET v1/role/ to reproduce the error)
  //        This is a very hacky fix but it is avoiding unnecessary calls to Redis and Postgress
  //        if you feel lucky when this bug finds you try to fix it.
  //        Love you,
  //        Os
  if (res.locals.account) return next();

  logger.info(`Account deserialization attempt ${new Date()} `);
  const accessToken = getAccessToken(req);
  const refreshToken = getRefreshToken(req);
  if (!accessToken && !refreshToken) return next(new UnauthorizedException());

  const publicKey = accessToken ? PUBLIC_KEY : refreshToken ? REFRESH_PUBLIC_KEY : null;
  if (!publicKey) return next(new UnauthorizedException());

  const data = verify(accessToken || refreshToken, publicKey);
  if (!data) return next(new UnauthorizedException());

  const account = await AccountService.verifyAccount(data);
  const profile = await ProfileService.findOne({ account: account.id });
  const roles = profile?.roles ? _.keyBy(profile.roles as Role[], 'organizationId') : {};

  logger.info(`Account deserialization success: ${JSON.stringify(data)} `);

  res.locals.account = account;
  res.locals.profile = profile;
  res.locals.roles = roles;

  return next();
}
