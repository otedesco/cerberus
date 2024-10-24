import { compareWithHash, generateHash, sign, verify } from '@otedesco/commons';
import { notifySync } from '@otedesco/notify';
import _ from 'lodash';
import { Transaction } from 'objection';

import { PUBLIC_KEY, SALT_ROUNDS, SECRET_KEY, VERIFICATION_TOKEN_EXPIRE, Topics, Components, EventsByComponent, TESTING_OTP } from '../../../configs';
import { VerificationStatusEnum, VerificationStatusType } from '../../../enums';
import { ForbiddenException, ResourceNotFoundException, UnauthorizedException, ValidationException } from '../../../exceptions';
import { Transaction as Transactional } from '../../../utils/transaction';
import { Account, AccountDetail, SecuredAccount, Session } from '../interfaces';
import { CachedAccountRepository } from '../repositories';

import { SessionService, AccountDetailsService } from './';

const topic = Topics[Components.ACCOUNT];
const events = EventsByComponent[Components.ACCOUNT];

function sanitize(account: Account): SecuredAccount {
  const keysToOmit = ['password', 'salt'];

  return _.omit(account, keysToOmit) as SecuredAccount;
}

function shouldUpdateAccountDetails(updatedParams: Partial<Account>) {
  return updatedParams.phoneNumber || updatedParams.email;
}

const updateVerificationStatus = (value: 'email' | 'sms', status: VerificationStatusType): Partial<AccountDetail> => ({
  [value === 'email' ? 'emailVerificationStatus' : 'phoneVerificationStatus']: status,
});

function signVerificationToken(account: SecuredAccount, method: 'email' | 'sms' = 'email'): SecuredAccount {
  // TODO: move this logic to OTP generator on '@otedesco/commons'
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const token = sign({ accountId: account.id, email: account.email, phoneNumber: account.phoneNumber, otp, method }, SECRET_KEY, {
    expiresIn: `${VERIFICATION_TOKEN_EXPIRE}s`,
  });

  return { ...account, token, otp };
}

async function validateAccount({ email }: Partial<Account>): Promise<void> {
  const account = await CachedAccountRepository.findOne({ email });
  if (account) throw new ValidationException({ status: 400 });
}

async function mapAccountData(account: Partial<Account>): Promise<Partial<Account>> {
  if (account.password) {
    const [hash, salt] = await generateHash(account.password, SALT_ROUNDS);

    return { ...account, password: hash, salt };
  }

  return account;
}

function getAccountDetailsToUpdate(params: Partial<Account>) {
  if (params.email) {
    return { emailVerificationStatus: VerificationStatusEnum.VERIFICATION_PENDING };
  }
  if (params.phoneNumber) {
    return { phoneVerificationStatus: VerificationStatusEnum.VERIFICATION_PENDING };
  }

  return {};
}

// FIXME: This function probably should receive an account function handler to execute the update
// ie.: updateAccountAndDetails(params: Partial<Account>, handler: (params: Partial<Account>) => Promise<Account>, tx?: Transaction)
// so it can be reused on the create method
async function transactionalUpdate(params: Partial<Account>, tx?: Transaction) {
  const updateAccountAndDetails = async (transaction = tx) => {
    const updatedAccount = await CachedAccountRepository.update(params, transaction);
    if (!updatedAccount) throw new ResourceNotFoundException();

    const accountDetailsToUpdate = getAccountDetailsToUpdate(params);
    if (_.isEmpty(accountDetailsToUpdate)) return updatedAccount;

    await AccountDetailsService.upsert(updatedAccount.id, accountDetailsToUpdate, transaction);

    return updatedAccount;
  };

  if (!tx) {
    return Transactional.run(updateAccountAndDetails);
  }

  return updateAccountAndDetails();
}

export async function findOne(filters: Partial<Account & SecuredAccount> | null, sanitizeResult: true): Promise<SecuredAccount | null>;
export async function findOne(filters: Partial<Account & SecuredAccount> | null, sanitizeResult: false): Promise<Account | null>;
export async function findOne(filters: Partial<Account & SecuredAccount> | null, sanitizeResult: boolean = true): Promise<SecuredAccount | Account | null> {
  if (!filters) return null;
  const account = await CachedAccountRepository.findOne(filters);
  if (account && filters.signedSession) {
    SessionService.update({ id: filters.signedSession, accountId: account.id, lastActivityLog: 'reading account' });
  }

  if (sanitizeResult && account) {
    return sanitize(account) as SecuredAccount;
  }

  return account as Account;
}

export async function create(payload: Partial<Account>, tx?: Transaction): Promise<SecuredAccount> {
  await validateAccount(payload);
  const accountData = await mapAccountData(payload);
  const account = sanitize(await CachedAccountRepository.create(accountData, tx));
  await AccountDetailsService.upsert(account.id, { emailVerificationStatus: VerificationStatusEnum.VERIFICATION_PENDING }, tx);
  const signedAccount = signVerificationToken(account);

  // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
  notifySync(topic, events.CreatedEvent, signedAccount);

  return { ...account, token: signedAccount.token };
}

export async function verifyAccount({ email, password, signedSession }: Partial<Account & SecuredAccount>): Promise<SecuredAccount> {
  const account = (await findOne({ email, signedSession }, false)) as Account;
  if (!account) throw new UnauthorizedException();

  if (!!password) {
    const isValid = await compareWithHash(password, account.password);
    if (!isValid) throw new UnauthorizedException();
    const session = await SessionService.create({ accountId: account.id, lastActivityLog: 'account sign in' });

    // FIXME: fix this illegal casting
    return { ...sanitize(account), signedSession: (session as Session).id };
  }

  return sanitize(account);
}

// TODO: rename this to verifyOTP
export async function verifyEmail({ token, otp }: { token?: string; otp: string }): Promise<void> {
  if (!token) throw new UnauthorizedException();

  const payload = verify<Partial<{ accountId: string; email: string; phoneNumber: string; otp: string; method: 'email' | 'sms' }>>(token, PUBLIC_KEY);
  if (!payload) throw new UnauthorizedException();
  // FIXME: remove this after testing
  if (![payload.otp, TESTING_OTP].includes(otp)) throw new UnauthorizedException();

  // FIXME: update status in AccountDetails Table
  const account = await findOne({ id: payload.accountId, email: payload.email }, false);
  if (account) {
    // TODO: Fix this illegal cast
    await AccountDetailsService.upsert(account.id, updateVerificationStatus(payload.method!, VerificationStatusEnum.VERIFIED));
    // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
    notifySync(topic, events.UpdatedEvent, { ...sanitize(account), updated: ['status'] });
  }

  return;
}

export async function recovery({ email }: Partial<Account>) {
  const account = await findOne({ email }, true);
  if (!account?.id) return;
  // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
  await notifySync(topic, events.RecoveryEvent, signVerificationToken(account));

  return;
}

export async function changePassword({ password }: Partial<Account>, token: string): Promise<void> {
  const payload = verify<Partial<Account>>(token, PUBLIC_KEY);
  if (!payload || !payload.email) throw new ForbiddenException();

  const account = await findOne({ email: payload.email }, false);
  if (!account) throw new UnauthorizedException();

  const [hash, salt] = await generateHash(password!, SALT_ROUNDS);

  // TODO: Review this logic after testing, email shouldn't be updated
  const updatedRecord = await CachedAccountRepository.update({ id: account.id, email: payload.email, password: hash, salt });
  if (updatedRecord) {
    // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
    notifySync(topic, events.UpdatedEvent, { ...sanitize(updatedRecord), updated: ['password'] });
  }

  return;
}

export async function createInvitation({ email }: { email: string }): Promise<void> {
  // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
  notifySync(topic, events.InviteEvent, { email });
}

export async function update(account: Partial<Account>, tx?: Transaction): Promise<Account | undefined> {
  const updatableKeys = ['active', 'detailsId', 'phoneNumber'];
  const updatedParams = { ..._.pick(account, updatableKeys), id: account.id, email: account.email };

  let results: Account;
  if (shouldUpdateAccountDetails(updatedParams)) {
    results = await transactionalUpdate(updatedParams, tx);
  }
  const updatedAccount = await CachedAccountRepository.update(updatedParams, tx);
  if (!updatedAccount) throw new ResourceNotFoundException();
  results = updatedAccount;

  if (results) {
    // TODO: CHANGE TO NOTIFYASYNC AFTER NOTIFY IS FIXED
    notifySync(topic, events.UpdatedEvent, { ...sanitize(results), updated: updatableKeys });
  }

  return results;
}

export const resendVerificationCode = async (account: Account, method: 'email' | 'sms' = 'email') => {
  await AccountDetailsService.upsert(account.id, updateVerificationStatus(method, VerificationStatusEnum.VERIFICATION_REQUESTED));

  const signedAccount = signVerificationToken(account, method);
  notifySync(topic, events.CreatedEvent, { ...sanitize(account), signedAccount, method });

  return { token: signedAccount.token };
};
