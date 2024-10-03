import { Transaction } from 'objection';

import { Transaction as Transactional } from '../../../utils';
import { Account, AccountDetail } from '../interfaces';
import { AccountDetailsRepository } from '../repositories';

import { AccountService } from './';

function transactionalCreate(accountId: Account['id'], details: Partial<AccountDetail>, returning = false) {
  return async (tx: Transaction) => {
    const result = await AccountDetailsRepository.create(details, tx);
    await AccountService.update({ id: accountId, detailsId: result.id }, tx);

    if (returning) return result;
  };
}

export async function upsert({ id, detailsId }: Account, params: Partial<AccountDetail>, tx?: Transaction): Promise<AccountDetail | undefined> {
  if (detailsId) {
    return AccountDetailsRepository.update({ id: detailsId, ...params }, tx);
  }

  return Transactional.run(transactionalCreate(id, params, true));
}
