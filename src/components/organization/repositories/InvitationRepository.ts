import { QueryBuilder, Transaction } from 'objection';

import { Invitation } from '../interfaces';
import { Invitations } from '../models';

const filterQuery = (query: QueryBuilder<Invitations, Invitations[]>, filter: Partial<Invitation>) => {
  const { id, email } = filter;

  if (id) query.where(`${Invitations.tableName}.id`, id);
  if (email) query.where(`${Invitations.tableName}.email`, email);

  return query;
};

export async function create(invitation: Partial<Invitation>, tx?: Transaction) {
  return Invitations.query(tx).insert(invitation);
}

export async function findOne(filter: Partial<Invitation>) {
  return filterQuery(Invitations.query(), filter).first();
}

export async function update({ email, data }: { email: Invitation['email']; data: Partial<Invitation> }, tx?: Transaction) {
  return Invitations.query(tx).patch(data).where(`${Invitations.tableName}.email`, '=', email).returning('*').first();
}
