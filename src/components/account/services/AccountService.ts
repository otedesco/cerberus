import { notify } from '@otedesco/notify';
import { compareWithHash, generateHash, sign, verify } from '@otedesco/commons';
import _ from 'lodash';
import { Transaction } from 'objection';

import { SessionService } from '..';
import { PUBLIC_KEY, SALT_ROUNDS, SECRET_KEY, VERIFICATION_TOKEN_EXPIRE, Topics, Components, EventsByComponent } from '../../../configs';
import { AccountStatus } from '../../../enums';
import { ForbiddenException } from '../../../exceptions';
import { UnauthorizedException } from '../../../exceptions';
import { ValidationException } from '../../../exceptions';
import { Account, SecuredAccount, Session } from '../interfaces';
import * as CachedRepository from '../repositories/CachedAccountRepository';

const topic = Topics[Components.ACCOUNT];
const events = EventsByComponent[Components.ACCOUNT];

function sanitize(account: Account): SecuredAccount {
  const keysToOmit = ['password', 'salt'];

  return _.omit(account, keysToOmit) as SecuredAccount;
}

function signVerificationToken(account: SecuredAccount): SecuredAccount {
  const token = sign(_.pick(account, 'email'), SECRET_KEY, { expiresIn: `${VERIFICATION_TOKEN_EXPIRE}s` });

  return { ...account, token };
}

async function validateAccount({ email }: Partial<Account>): Promise<void> {
  const account = await CachedRepository.findOne({ email });
  if (account) throw new ValidationException({ status: 400 });
}

async function mapAccountData(account: Partial<Account>): Promise<Partial<Account>> {
  const accountData = {
    ...account,
    status: AccountStatus.EMAIL_VERIFICATION_PENDING,
  };

  if (account.password) {
    const [hash, salt] = await generateHash(account.password, SALT_ROUNDS);

    return { ...accountData, password: hash, salt };
  }

  return accountData;
}

export async function findOne(filters: Partial<Account & SecuredAccount> | null, sanitizeResult: boolean = true) {
  if (!filters) return null;
  const account = await CachedRepository.findOne(filters);
  if (account && filters.signed_session) {
    // session last acctivity implementation  if signed account exist
    SessionService.update({ id: filters.signed_session, accountId: account.id, lastActivityLog: 'reading account' });
    // filters = _.omit(filters, 'signed_session');
  }

  if (sanitizeResult) {
    return sanitize(account) as SecuredAccount;
  }

  return account;
}

export async function create(payload: Partial<Account>, tx?: Transaction): Promise<SecuredAccount> {
  await validateAccount(payload);
  const accountData = await mapAccountData(payload);
  const account = sanitize(await CachedRepository.create(accountData, tx));

  notify(topic, events.CreatedEvent, signVerificationToken(account));

  return account;
}

export async function verifyAccount({ email, password, signed_session }: Partial<Account & SecuredAccount>): Promise<SecuredAccount> {
  const account = (await findOne({ email, signed_session }, false)) as Account;
  if (!account) throw new UnauthorizedException();

  if (!!password) {
    const isValid = await compareWithHash(password, account.password);
    if (!isValid) throw new UnauthorizedException();
    const session = (await SessionService.create({ accountId: account.id, lastActivityLog: 'account sign in' })) as Session;

    return { ...sanitize(account), signed_session: session.id };
  }

  return sanitize(account);
}

export async function verifyEmail({ token }: { token: string }): Promise<void> {
  const payload = verify<Partial<Account>>(token, PUBLIC_KEY);
  if (!payload) throw new ForbiddenException();

  const account = await CachedRepository.update({ email: payload.email, status: AccountStatus.VERIFIED });
  if (account) {
    notify(topic, events.UpdatedEvent, { ...sanitize(account), updated: ['status'] });
  }

  return;
}

export async function recovery({ email }: Partial<Account>) {
  const account = await findOne({ email });
  if (!account?.id) return;

  await notify(topic, events.RecoveryEvent, signVerificationToken(account));

  return;
}

export async function changePassword({ password }: Partial<Account>, token: string): Promise<void> {
  const payload = verify<Partial<Account>>(token, PUBLIC_KEY);
  if (!payload) throw new ForbiddenException();

  const [hash, salt] = await generateHash(password!, SALT_ROUNDS);
  const account = await CachedRepository.update({ email: payload.email, password: hash, salt });
  if (account) {
    notify(topic, events.UpdatedEvent, { ...sanitize(account), updated: ['password'] });
  }

  return;
}

export async function createInvitation({ email }: { email: string }): Promise<void> {
  return notify(topic, events.InviteEvent, { email });
}
