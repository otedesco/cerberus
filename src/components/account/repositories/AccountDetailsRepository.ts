import { Transaction } from 'objection';

import { AccountDetail } from '../interfaces';
import { AccountDetails } from '../models';

export async function create(details: Partial<AccountDetail>, tx?: Transaction): Promise<AccountDetail> {
  return AccountDetails.query(tx).insert(details);
}

export async function update({ id, ...updatedKeys }: Partial<AccountDetail>, tx?: Transaction): Promise<AccountDetail | undefined> {
  return AccountDetails.query(tx).patch(updatedKeys).where({ id }).returning('*').first();
}
