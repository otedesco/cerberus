import { Transaction } from 'objection';

import { Account, AccountDetail } from '../interfaces';
import { AccountDetailsRepository } from '../repositories';

export async function findOne(params: Partial<AccountDetail>): Promise<AccountDetail | undefined> {
  return AccountDetailsRepository.findOneSimple(params);
}

export async function upsert(accountId: Account['id'], params: Partial<AccountDetail>, tx?: Transaction): Promise<AccountDetail | undefined> {
  const details = await findOne({ accountId });
  if (details) {
    return AccountDetailsRepository.update({ id: details.id, ...params }, tx);
  }

  return AccountDetailsRepository.create({ accountId, ...params }, tx);
}
