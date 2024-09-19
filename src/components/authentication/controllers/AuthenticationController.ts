import { CookieOptions, Request, Response } from 'express';
import _ from 'lodash';

import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from '../../../configs';
import { createResponse, resolveResponse } from '../../../handlers';
import { SignIn, SignUp } from '../interfaces';
import * as AuthenticationService from '../services/AuthenticationService';

export async function signUp(req: Request, res: Response): Promise<void> {
  const accountData: SignUp = req.body;
  const { status, data } = await createResponse(AuthenticationService.signUp(_.omit(accountData, 'passwordConfirmation')));

  res.status(status).send({ data });
}

export async function signIn(req: Request, res: Response): Promise<void> {
  const payload: SignIn = req.body;

  const { status, data } = await resolveResponse(AuthenticationService.signIn(payload));
  res.cookie('access_token', data.access_token, ACCESS_TOKEN_COOKIE_OPTIONS as CookieOptions);
  res.cookie('refresh_token', data.refresh_token, REFRESH_TOKEN_COOKIE_OPTIONS as CookieOptions);
  res.cookie('logged_in', true, {
    ...ACCESS_TOKEN_COOKIE_OPTIONS,
    httpOnly: false,
  } as CookieOptions);

  res.status(status).json({ data });
}

export async function signOut(_req: Request, res: Response): Promise<void> {
  // TODO: implement logout logic

  res.cookie('access_token', '', { maxAge: 1 });
  res.cookie('refresh_token', '', { maxAge: 1 });
  res.cookie('logged_in', '', { maxAge: 1 });

  res.status(200).send();
}

export async function refreshAuthorization({ cookies }: Request, res: Response): Promise<void> {
  const refreshToken = _.get(cookies, 'refresh_token', null);
  const { status, data } = await createResponse(AuthenticationService.refreshToken(refreshToken));

  res.cookie('access_token', data.access_token, ACCESS_TOKEN_COOKIE_OPTIONS as CookieOptions);
  res.cookie('logged_in', true, {
    ...ACCESS_TOKEN_COOKIE_OPTIONS,
    httpOnly: false,
  } as CookieOptions);

  res.status(status).json({ data });
}
