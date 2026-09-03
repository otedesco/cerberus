import { QueryBuilder, Transaction } from 'objection';

import { AccountDetail } from '../interfaces';
import { AccountDetails } from '../models';

function filterQuery(query: QueryBuilder<AccountDetails>, filter: Partial<AccountDetail>) {
  const { id, accountId } = filter;

  if (accountId) query.where('account_id', accountId);
  if (id) query.where('id', id);

  return query;
}

export async function create(details: Partial<AccountDetail>, tx?: Transaction): Promise<AccountDetail> {
  return AccountDetails.query(tx).insert(details);
}

export async function update({ id, ...updatedKeys }: Partial<AccountDetail>, tx?: Transaction): Promise<AccountDetail | undefined> {
  return AccountDetails.query(tx).patch(updatedKeys).where({ id }).returning('*').first();
}

export function findOneSimple(filter: Partial<AccountDetail>, tx?: Transaction) {
  return filterQuery(AccountDetails.query(tx), filter).first();
}
