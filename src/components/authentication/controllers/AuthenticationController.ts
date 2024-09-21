import { CookieOptions, Request, Response } from 'express';
import _ from 'lodash';

import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from '../../../configs';
import { createResponse, resolveResponse } from '../../../handlers';
import { SignIn, SignUp } from '../interfaces';
import * as AuthenticationService from '../services/AuthenticationService';

export async function signUp(req: Request, res: Response): Promise<void> {
  const accountData: SignUp = req.body;
  const { status } = await createResponse(AuthenticationService.signUp(_.omit(accountData, 'passwordConfirmation')));

  res.status(status).send();
}

export async function signIn(req: Request, res: Response): Promise<void> {
  const payload: SignIn = req.body;

  const { status, data } = await resolveResponse(AuthenticationService.signIn(payload));
  res.cookie('accessToken', data.access_token, ACCESS_TOKEN_COOKIE_OPTIONS as CookieOptions);
  res.cookie('refreshToken', data.refresh_token, REFRESH_TOKEN_COOKIE_OPTIONS as CookieOptions);
  res.cookie('loggedIn', true, {
    ...ACCESS_TOKEN_COOKIE_OPTIONS,
    httpOnly: false,
  } as CookieOptions);

  res.status(status).json({ data });
}

export async function signOut(_req: Request, res: Response): Promise<void> {
  // TODO: implement logout logic

  res.cookie('accessToken', '', { maxAge: 1 });
  res.cookie('refreshToken', '', { maxAge: 1 });
  res.cookie('loggedIn', '', { maxAge: 1 });

  res.status(200).send();
}

export async function refreshAuthorization({ cookies }: Request, res: Response): Promise<void> {
  const refreshToken = _.get(cookies, 'refreshToken', null);
  const { status, data } = await resolveResponse(AuthenticationService.refreshToken(refreshToken));

  res.cookie('accessTtoken', data.accessToken, ACCESS_TOKEN_COOKIE_OPTIONS as CookieOptions);
  res.cookie('loggedIn', true, {
    ...ACCESS_TOKEN_COOKIE_OPTIONS,
    httpOnly: false,
  } as CookieOptions);

  res.status(status).json({ data });
}
