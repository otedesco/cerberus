import { QueryBuilder, Transaction } from 'objection';

import { Account } from '../interfaces/Account';
import { Accounts } from '../models';

const filterQuery = (query: QueryBuilder<Accounts, Accounts[]>, filter: Partial<Account>) => {
  const { id, email } = filter;

  if (email) query.where(`${Accounts.tableName}.email`, '=', email);
  if (id) query.where(`${Accounts.tableName}.id`, id);

  return query;
};

export async function findOne(filter: Partial<Account>, tx?: Transaction) {
  return filterQuery(Accounts.query(tx), filter).first();
}

export async function create(account: Partial<Account>, tx?: Transaction) {
  return Accounts.query(tx).insert(account);
}

export async function update({ id, ...args }: Partial<Account>, tx?: Transaction) {
  return Accounts.query(tx).patch(args).where({ id }).returning('*').first();
}
