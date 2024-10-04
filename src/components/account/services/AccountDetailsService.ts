import { Transaction } from 'objection';

import { Account, AccountDetail } from '../interfaces';
import { AccountDetailsRepository } from '../repositories';

export async function upsert({ id, detailsId }: Account, params: Partial<AccountDetail>, tx?: Transaction): Promise<AccountDetail | undefined> {
  if (detailsId) {
    return AccountDetailsRepository.update({ id: detailsId, ...params }, tx);
  }

  return AccountDetailsRepository.create({ accountId: id, ...params }, tx);
}
