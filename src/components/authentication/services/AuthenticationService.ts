import { sign, verify } from '@otedesco/commons';
import _ from 'lodash';
import { Transaction } from 'objection';

import { REFRESH_PUBLIC_KEY, REFRESH_SECRET_KEY, SECRET_KEY, SESSION_EXPIRE, TOKEN_EXPIRE } from '../../../configs';
import { UnauthorizedException } from '../../../exceptions';
import { Transaction as Transactional } from '../../../utils';
import { Account, SecuredAccount, AccountService, SignedSession } from '../../account';
import { ProfileService } from '../../profile';
import { SignIn } from '../interfaces';

const tokenSub: (keyof SecuredAccount)[] = ['email', 'signedSession'];

function transactionalCreate(payload: Pick<Account, 'email' | 'password'>, returning = false) {
  const accountToCreate = _.omit(payload, ['passwordConfirmation', 'name', 'lastname']);
  const profileToCreate = _.pick(payload, ['name', 'lastname']);

  return async (tx: Transaction) => {
    const account = await AccountService.create(accountToCreate, tx);
    const profile = await ProfileService.create({ ...profileToCreate, account: account.id }, tx);

    if (returning) return { ...account, profile: profile };
  };
}

async function signSession(handler: Promise<SecuredAccount | null>): Promise<SignedSession> {
  const account = await handler;
  if (!account) throw new UnauthorizedException();

  const payload = _.pick(account, tokenSub);

  return {
    accessToken: sign(payload, SECRET_KEY, { expiresIn: `${TOKEN_EXPIRE}s` }),
    refreshToken: sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: `${SESSION_EXPIRE}s`,
    }),
  };
}

export async function signUp(payload: Pick<Account, 'email' | 'password'>) {
  return Transactional.run(transactionalCreate(payload, true));
}

export function signIn(payload: SignIn) {
  return signSession(AccountService.verifyAccount(payload));
}

export async function refreshToken(token: string) {
  if (!token) throw new UnauthorizedException();

  return signSession(AccountService.findOne(verify(token, REFRESH_PUBLIC_KEY)));
}
